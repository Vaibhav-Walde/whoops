/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "y-websocket" {
  import * as Y from "yjs";

  export class WebsocketProvider {
    constructor(serverUrl: string, roomName: string, doc: Y.Doc, options?: any);
    awareness: any;
    destroy(): void;
    connect(): void;
    disconnect(): void;
  }
}
