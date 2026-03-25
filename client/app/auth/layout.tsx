/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthNavbar from "@/components/auth/AuthNavbar";
import { useToast } from "@/context/ToastContext";
import Loader from "@/components/ui/Loader";
import "../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const { error } = useToast();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setRedirecting(true);
      error("You are already logged in. Redirecting to dashboard.");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);
    }

    if (status === "unauthenticated") {
      setRedirecting(false);
    }
  }, [status, router]);

  if (status === "loading" || redirecting) {
    return <Loader />;
  }

  return (
    <>
      <AuthNavbar />
      <main className="page-transition">{children}</main>
    </>
  );
}
