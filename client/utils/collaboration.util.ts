import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { WEBSOCKET_URL } from "@/config/constants";

const ydocMap = new Map<string, Y.Doc>();
const providerMap = new Map<string, WebsocketProvider>();
const refCountMap = new Map<string, number>();
const awarenessListeners = new Map<string, Array<() => void>>();

export const getCollaborationInstance = (documentId: string, initialContent?: string) => {
  if (!ydocMap.has(documentId)) {
    const ydoc = new Y.Doc();

    if (initialContent) {
      try {
        const binary = Uint8Array.from(atob(initialContent), (c) => c.charCodeAt(0));
        Y.applyUpdate(ydoc, binary);
      } catch (e) {
        console.error("Failed to rehydrate Yjs state:", e);
      }
    }

    const provider = new WebsocketProvider(WEBSOCKET_URL, documentId, ydoc, {
      connect: true,
    });

    ydocMap.set(documentId, ydoc);
    providerMap.set(documentId, provider);
    refCountMap.set(documentId, 0);

    // flush any pending listeners that registered before provider existed
    const pending = awarenessListeners.get(documentId) ?? [];
    pending.forEach((fn) => fn());
    awarenessListeners.delete(documentId);
  }

  refCountMap.set(documentId, (refCountMap.get(documentId) ?? 0) + 1);

  return {
    ydoc: ydocMap.get(documentId)!,
    provider: providerMap.get(documentId)!,
  };
};

export const destroyCollaborationInstance = (documentId: string) => {
  const count = (refCountMap.get(documentId) ?? 1) - 1;
  refCountMap.set(documentId, count);

  if (count <= 0) {
    providerMap.get(documentId)?.destroy();
    providerMap.delete(documentId);
    ydocMap.get(documentId)?.destroy();
    ydocMap.delete(documentId);
    refCountMap.delete(documentId);
    awarenessListeners.delete(documentId);
  }
};

export const setAwarenessRole = (documentId: string, role: string, email: string) => {
  const provider = providerMap.get(documentId);
  if (!provider) {
    console.log("setAwarenessRole: no provider found for", documentId);
    return;
  }
  const current = provider.awareness.getLocalState() ?? {};
  provider.awareness.setLocalState({ ...current, role, email });
  console.log("setAwarenessRole: set state", { role, email });
};

export const onAwarenessRoleChange = (
  documentId: string,
  email: string,
  callback: (role: string) => void
) => {
  const register = () => {
    const provider = providerMap.get(documentId);
    if (!provider) return;

    console.log("onAwarenessRoleChange: listening for email", email);

    const handler = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider.awareness.getStates().forEach((state: any, clientId: number) => {
        if (
          clientId !== provider.awareness.clientID &&
          state.roleUpdate?.email === email &&
          state.roleUpdate?.role
        ) {
          console.log("role change detected:", state.roleUpdate.role);
          callback(state.roleUpdate.role);
        }
      });
    };

    provider.awareness.on("change", handler);
    return () => provider.awareness.off("change", handler);
  };

  // if provider already exists, register immediately
  if (providerMap.has(documentId)) {
    return register();
  }

  // otherwise queue it until provider is created
  const pending = awarenessListeners.get(documentId) ?? [];
  let cleanup: (() => void) | undefined;
  pending.push(() => {
    cleanup = register() ?? undefined;
  });
  awarenessListeners.set(documentId, pending);

  return () => cleanup?.();
};

export const onAwarenessRemoval = (documentId: string, email: string, callback: () => void) => {
  const register = () => {
    const provider = providerMap.get(documentId);
    if (!provider) return;

    const handler = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provider.awareness.getStates().forEach((state: any, clientId: number) => {
        if (clientId !== provider.awareness.clientID && state.removalUpdate?.email === email) {
          callback();
        }
      });
    };

    provider.awareness.on("change", handler);
    return () => provider.awareness.off("change", handler);
  };

  if (providerMap.has(documentId)) {
    return register();
  }

  const pending = awarenessListeners.get(documentId) ?? [];
  let cleanup: (() => void) | undefined;
  pending.push(() => {
    cleanup = register() ?? undefined;
  });
  awarenessListeners.set(documentId, pending);

  return () => cleanup?.();
};

export const getProviderForDocument = (documentId: string) => {
  return providerMap.get(documentId) ?? null;
};
