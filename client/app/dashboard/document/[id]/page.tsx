"use client";

import DocumentEditor from "@/components/dashboard/DocumentEditor";
import DocumentHeader from "@/components/dashboard/DocumentHeader";
import InviteButton from "@/components/dashboard/InviteButton";
import SaveStatus from "@/components/dashboard/SaveStatus";
import GhostButton from "@/components/ui/GhostButton";
import Loader from "@/components/ui/Loader";
import { CollaboratorList, ManageCollaboratorsModal } from "@/components/dashboard/collaborator";
import { useToast } from "@/context/ToastContext";
import { Document, DocumentMember, DocumentSaving } from "@/types/common";
import api, { getErrorMessage } from "@/utils/axios.util";
import { generateUserColor } from "@/utils/common.util";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  onAwarenessRemoval,
  onAwarenessRoleChange,
  setAwarenessRole,
} from "@/utils/collaboration.util";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { error } = useToast();

  const [document, setDocument] = useState<Document | null>(null);
  const [fetching, setFetching] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<DocumentMember[]>([]);
  const [savingDocumentStatus, setSavingDocumentStatus] = useState<DocumentSaving>("saved");
  const { data: session } = useSession();

  const currentUser = {
    name: session?.user.name ?? "Anonymous",
    color: generateUserColor(session?.user.email ?? session?.user.name ?? "anonymous"),
  };

  const fetchDocument = async () => {
    try {
      setFetching(true);
      const response = await api.get(`/document/${id}`);
      const doc = response.data.document;
      setDocument(doc);
      setIsReadOnly(doc.role === "VIEWER");
      setIsOwner(doc.role === "OWNER");
    } catch (err) {
      error(getErrorMessage(err));
      router.replace("/dashboard");
    } finally {
      setFetching(false);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await api.get(`/document/${id}/collaborators`);
      setCollaborators(response.data.collaborators);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id || !document || !session?.user.email) return;
    setAwarenessRole(id, document.role, session.user.email);
  }, [id, document, session]);

  useEffect(() => {
    if (!id || !session?.user) return;

    const cleanup = onAwarenessRoleChange(id, session?.user.email, (newRole) => {
      setIsReadOnly(newRole === "VIEWER");
      setIsOwner(newRole === "OWNER");
    });

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, session?.user.email]);

  useEffect(() => {
    if (!id || !session?.user?.email) return;

    const cleanup = onAwarenessRemoval(id, session.user.email, () => {
      error("You have been removed from this document.");
      router.replace("/dashboard");
    });

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, session?.user?.email]);

  useEffect(() => {
    if (id) {
      fetchDocument();
      fetchCollaborators();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDocumentUpdate = (updated: Partial<Document>) => {
    setDocument((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  if (fetching) return <Loader />;
  if (!document) return null;

  return (
    <div
      className="min-h-screen font-mono p-10"
      style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <GhostButton label="Back" icon={ArrowLeft} onClick={() => router.back()} />
          <div className="flex items-center gap-3">
            <CollaboratorList collaborators={collaborators} />
            {isOwner && <InviteButton onClick={() => setModalOpen(true)} />}
            <SaveStatus status={savingDocumentStatus} />
          </div>
        </div>

        {/* Header */}
        <DocumentHeader
          document={document}
          onUpdate={handleDocumentUpdate}
          isReadOnly={isReadOnly}
        />

        {/* Editor */}
        <DocumentEditor
          documentId={id}
          currentUser={currentUser}
          initialContent={document.content ?? undefined}
          isReadOnly={isReadOnly}
          onSaveStatusChange={setSavingDocumentStatus}
        />
      </div>

      {modalOpen && (
        <ManageCollaboratorsModal
          documentId={id}
          collaborators={collaborators}
          onClose={() => setModalOpen(false)}
          onRefresh={fetchCollaborators}
        />
      )}
    </div>
  );
};

export default Page;
