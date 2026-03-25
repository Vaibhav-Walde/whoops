import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SessionContext from "@/context/SessionContext";
import ServerToastProvider from "@/context/ServerToastProvider";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Draftly — Real-time Collaborative Document Editor",
  description:
    "Draftly is a real-time collaborative document editor built for teams. Write together, assign roles, track versions, and stay in sync — all in one place.",
  keywords: [
    "collaborative document editor",
    "real-time editing",
    "team collaboration",
    "document management",
    "Yjs",
    "rich text editor",
  ],
  authors: [{ name: "Shivam Kumar" }],
  openGraph: {
    title: "Draftly — Real-time Collaborative Document Editor",
    description:
      "Write together in real time. Invite your team, assign roles, and watch edits appear live — with full version history and zero data loss.",
    url: "https://draftly-snowy.vercel.app",
    siteName: "Draftly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Draftly — Real-time Collaborative Document Editor",
    description:
      "Write together in real time. Invite your team, assign roles, and watch edits appear live.",
    creator: "@shivamkumardev",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionContext>
            <ServerToastProvider>{children}</ServerToastProvider>
          </SessionContext>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
