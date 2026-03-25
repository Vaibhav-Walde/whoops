"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { generateUserColor, getInitials } from "@/utils/common.util";
import Image from "next/image";

interface Props {
  currentImage: string | null;
  name: string;
  email: string;
  onClose: () => void;
  onSuccess: (newImageUrl: string) => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

const ImageUploadModal = ({ currentImage, name, email, onClose, onSuccess }: Props) => {
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [imgError, setImgError] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const color = generateUserColor(email);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const handleClose = () => {
    if (uploadState === "uploading") return;
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setErrorMsg("Only image files are allowed.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg("Image must be under 5MB.");
      return;
    }
    setErrorMsg("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    setUploadState("idle");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadState("uploading");
    setErrorMsg("");

    try {
      // TODO: replace with actual API call
      // const formData = new FormData();
      // formData.append("image", file);
      // const response = await api.patch("/user/profile/image", formData);
      // const newImageUrl = response.data.imageUrl;

      console.log("Image upload API call — simulated", {
        fileName: file.name,
        fileSize: file.size,
      });

      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // simulate 90% success, 10% failure for demo
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          Math.random() > 0.1 ? resolve() : reject(new Error("Upload failed. Please try again."));
        }, 1800);
      });

      const simulatedUrl = preview!; // replace with actual URL from API response
      setUploadState("success");

      setTimeout(() => {
        onSuccess(simulatedUrl);
        handleClose();
      }, 1000);
    } catch (err) {
      setUploadState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setUploadState("idle");
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayImage = preview ?? (imgError ? null : currentImage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        transition: "background-color 0.2s ease",
      }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-sm rounded-lg border font-mono flex flex-col"
        style={{
          backgroundColor: "var(--canvas)",
          borderColor: "var(--border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <ImageIcon size={14} style={{ color: "var(--primary)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Update profile photo
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={uploadState === "uploading"}
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
            }
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col items-center gap-6">
          {/* Avatar preview */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-all"
            style={{
              border: `3px solid ${color}`,
              backgroundColor: "var(--background)",
              boxShadow: preview ? `0 0 0 4px ${color}22` : "none",
            }}
          >
            {displayImage ? (
              <Image
                height={50}
                width={50}
                src={displayImage}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span
                className="font-semibold text-2xl"
                style={{ color: "var(--text-primary)", fontFamily: "monospace" }}
              >
                {getInitials(name)}
              </span>
            )}
          </div>

          {/* Drop zone */}
          <div
            className="w-full rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-2 py-7 cursor-pointer transition-all"
            style={{
              borderColor: dragOver ? "var(--primary)" : "var(--border)",
              backgroundColor: dragOver ? "#2563EB08" : "transparent",
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload size={18} style={{ color: "var(--text-secondary)" }} />
            <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
              Drag & drop or <span style={{ color: "var(--primary)" }}>browse</span>
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
              PNG, JPG, WEBP — max 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          {/* Status messages */}
          {errorMsg && (
            <div
              className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-md"
              style={{ backgroundColor: "#EF444415", color: "var(--error)" }}
            >
              <AlertCircle size={13} />
              {errorMsg}
            </div>
          )}

          {uploadState === "success" && (
            <div
              className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-md"
              style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}
            >
              <CheckCircle size={13} />
              Photo updated successfully!
            </div>
          )}

          {/* Selected file info */}
          {file && uploadState === "idle" && (
            <div
              className="w-full flex items-center justify-between text-xs px-3 py-2 rounded-md"
              style={{ backgroundColor: "var(--hover)", color: "var(--text-secondary)" }}
            >
              <span className="truncate max-w-45">{file.name}</span>
              <button
                onClick={reset}
                className="ml-2 shrink-0 underline cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-center gap-2 p-4 border-t w-full"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={handleClose}
            disabled={uploadState === "uploading"}
            className="flex-1 cursor-pointer text-sm px-6 py-2.5 rounded-md font-mono transition-colors disabled:opacity-50 border border-(--border)"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")
            }
          >
            Cancel
          </button>
          <PrimaryButton
            onClick={handleUpload}
            loading={uploadState === "uploading"}
            className="flex-1 flex items-center justify-center gap-3 min-w-fit"
            loadingText="Uploading..."
            disabled={!file || uploadState === "success"}
          >
            <Upload size={12} />
            Upload photo
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
