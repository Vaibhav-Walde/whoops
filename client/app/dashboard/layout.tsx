"use client";
import { useSession } from "next-auth/react";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";
import DashboardNavbar from "@/components/dashboard/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const { error } = useToast();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setRedirecting(true);
      error("You are not logged in. Redirecting to login.");
      setTimeout(() => {
        router.replace("/auth/login");
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  if (status === "loading" || redirecting) {
    return <Loader />;
  }
  return (
    <main className="page-transition">
      <DashboardNavbar />
      {children}
    </main>
  );
}
