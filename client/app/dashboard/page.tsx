"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FilePlus, FileText, Clock, Users } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import api, { getErrorMessage } from "@/utils/axios.util";
import { Document } from "@/types/common";
import DocumentCard from "@/components/dashboard/DocumentCard";
import CreateDocumentModal from "@/components/dashboard/CreateDocumentModal";
import DocumentCardSkeleton from "@/components/skeleton/DocumentCardSkeleton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useSession } from "next-auth/react";

type SharedDocument = Document & { role: "EDITOR" | "VIEWER" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SectionHeader = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={13} style={{ color: "var(--text-secondary)" }} />
    <p
      className="text-[10px] tracking-[0.4em] uppercase"
      style={{ color: "var(--text-secondary)" }}
    >
      {label}
    </p>
  </div>
);

const EmptyState = ({ label }: { label: string }) => (
  <div
    className="flex flex-col items-center justify-center py-14 gap-3 border rounded-md"
    style={{ borderColor: "var(--border)" }}
  >
    <FileText className="w-7 h-7" style={{ color: "var(--text-secondary)" }} strokeWidth={1.25} />
    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
      {label}
    </p>
  </div>
);

const Page = () => {
  const { error, success } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const [myDocs, setMyDocs] = useState<Document[]>([]);
  const [sharedDocs, setSharedDocs] = useState<SharedDocument[]>([]);
  const [fetchingMy, setFetchingMy] = useState(true);
  const [fetchingShared, setFetchingShared] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchMyDocuments = async () => {
    try {
      setFetchingMy(true);
      const response = await api.get("/document");
      setMyDocs(response.data.documents);
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setFetchingMy(false);
    }
  };

  const fetchSharedDocuments = async () => {
    try {
      setFetchingShared(true);
      const response = await api.get("/document/shared");
      setSharedDocs(response.data.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingShared(false);
    }
  };

  const onDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/document/${id}`);
      success("Document deleted.");
      await fetchMyDocuments();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchMyDocuments();
    fetchSharedDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen font-mono p-10"
      style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p
              className="text-[10px] tracking-[0.4em] uppercase mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              WELCOME {session?.user?.name?.split(" ")[0] ?? ""}
            </p>
            <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Dashboard
            </h1>
          </div>
          <PrimaryButton
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-md font-mono transition-all"
            style={{
              backgroundColor: "var(--primary)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--primary-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--primary)")
            }
          >
            <FilePlus size={13} />
            New document
          </PrimaryButton>
        </div>

        {/* My documents */}
        <div className="mb-12">
          <SectionHeader icon={Clock} label="My documents" />
          {fetchingMy ? (
            <DocumentCardSkeleton />
          ) : myDocs.length === 0 ? (
            <EmptyState label="No documents yet — create your first one" />
          ) : (
            <div
              className="flex flex-col gap-2 overflow-y-auto pr-1"
              style={{ maxHeight: "360px" }}
            >
              {myDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onClick={(doc) => router.push(`/dashboard/document/${doc.id}`)}
                  onDelete={onDelete}
                  deleting={deleting === doc.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Shared with me */}
        <div>
          <SectionHeader icon={Users} label="Shared with me" />
          {fetchingShared ? (
            <DocumentCardSkeleton />
          ) : sharedDocs.length === 0 ? (
            <EmptyState label="No documents shared with you yet" />
          ) : (
            <div
              className="flex flex-col gap-2 overflow-y-auto pr-1"
              style={{ maxHeight: "360px" }}
            >
              {sharedDocs.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onClick={(doc) => router.push(`/dashboard/document/${doc.id}`)}
                  badge={doc.role}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {createOpen && (
        <CreateDocumentModal onClose={() => setCreateOpen(false)} onCreated={fetchMyDocuments} />
      )}
    </div>
  );
};

export default Page;
