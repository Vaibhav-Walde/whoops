"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ArrowLeft, Save } from "lucide-react";
import GhostButton from "@/components/ui/GhostButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Input from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";
import api, { getErrorMessage } from "@/utils/axios.util";
import { generateUserColor } from "@/utils/common.util";
import ImageUploadModal from "@/components/dashboard/profile/ImageUploadModal";
import { User } from "@/types/common";
import LoadingProfile from "@/components/profile/LoadingProfile";
import DangerZone from "@/components/profile/DangerZone";
import MetaInfo from "@/components/profile/MetaInfo";
import AvatarSection from "@/components/profile/AvatarSection";
import Header from "@/components/profile/Header";

const Page = () => {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { success, error } = useToast();

  const [profile, setProfile] = useState<User | null>(null);
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const response = await api.get("/user/profile");
      const data = response.data.user;
      setProfile(data);
      setName(data.name);
    } catch (err) {
      error(getErrorMessage(err));
      router.replace("/dashboard");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      error("Name is required.");
      return;
    }
    if (name.trim() === profile?.name) {
      error("No changes to save.");
      return;
    }
    try {
      setUpdating(true);
      await api.patch("/user/profile", { name: name.trim() });
      await updateSession({ name: name.trim() });
      success("Profile updated.");
      fetchProfile();
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleImageSuccess = (newImageUrl: string) => {
    setProfile((prev) => (prev ? { ...prev, imageUrl: newImageUrl } : prev));
    setImgError(false);
    success("Profile photo updated.");
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    try {
      setDeleting(true);
      await api.delete("/user/profile");
      await signOut({ redirect: false });
      router.replace("/auth/login");
    } catch (err) {
      error(getErrorMessage(err));
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const color = generateUserColor(profile?.email ?? session?.user?.email ?? "");

  if (fetching) return <LoadingProfile />;

  if (!profile) return null;

  return (
    <div className="min-h-screen font-mono p-10" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <div className="mb-10">
          <GhostButton label="Back" icon={ArrowLeft} onClick={() => router.back()} />
        </div>

        {/* Page title */}
        <Header />

        {/* Card */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: "var(--canvas)",
            borderColor: "var(--border)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* Avatar section */}
          <AvatarSection
            profile={profile}
            color={color}
            imgError={imgError}
            setImgError={setImgError}
            setImageModalOpen={setImageModalOpen}
          />

          {/* Form section */}
          <div className="px-8 py-7 flex flex-col gap-5">
            <Input
              label="Name"
              value={name}
              className="rounded-md"
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              onKeyDown={(e) => e.key === "Enter" && handleUpdateProfile()}
            />
            <Input
              label="Email"
              value={profile.email}
              className="rounded-md"
              onChange={() => {}}
              disabled
            />

            {/* Meta info */}
            <MetaInfo createdAt={profile.createdAt} updatedAt={profile.updatedAt} />

            {/* Save */}
            <div className="flex justify-end pt-2">
              <PrimaryButton
                onClick={handleUpdateProfile}
                loading={updating}
                className="flex items-center justify-center gap-3 w-full"
                loadingText="Saving..."
              >
                <Save size={13} />
                Save changes
              </PrimaryButton>
            </div>
          </div>

          {/* Danger zone */}
          <DangerZone
            handleDeleteAccount={handleDeleteAccount}
            deleting={deleting}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
          />
        </div>
      </div>

      {imageModalOpen && (
        <ImageUploadModal
          currentImage={profile.imageUrl}
          name={profile.name}
          email={profile.email}
          onClose={() => setImageModalOpen(false)}
          onSuccess={handleImageSuccess}
        />
      )}
    </div>
  );
};

export default Page;
