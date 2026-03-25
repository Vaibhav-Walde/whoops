import {
  BASE_BACKEND_URL,
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/config/constants";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface AuthProfile {
  name?: string;
  email?: string;
  picture?: string;
  avatar_url?: string;
}

interface AuthUser {
  id?: string;
  name?: string | null;
  email?: string;
  backendToken?: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: GITHUB_ID!,
      clientSecret: GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        isSignup: { label: "Is Signup", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        try {
          const response = await axios.post(`${BASE_BACKEND_URL}/auth/email`, {
            name: credentials.name,
            email: credentials.email,
            otp: credentials.otp,
            isSignup: credentials.isSignup === "true",
          });

          const { token, name, email } = response.data.data;
          if (!token) return null;

          return {
            id: email,
            email,
            name: name || null,
            backendToken: token,
          };
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") return true;

      try {
        const imageUrl =
          account?.provider === "google"
            ? (profile as AuthProfile)?.picture
            : (profile as AuthProfile)?.avatar_url;

        const response = await axios.post(`${BASE_BACKEND_URL}/auth/register`, {
          name: profile?.name,
          email: profile?.email,
          provider: account?.provider?.toUpperCase(),
          imageUrl: imageUrl || "",
        });

        if (account) {
          account.backendToken = response.data.token;
        }

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    async jwt({ token, account, profile, user }) {
      // OAuth sign in
      if (account?.provider !== "credentials" && account?.backendToken) {
        token.accessToken = account.backendToken as string;
      }

      // Credentials sign in
      if (account?.provider === "credentials" && user) {
        token.accessToken = (user as AuthUser).backendToken;
        token.name = user.name;
        token.email = user.email;
      }

      // OAuth image
      if (profile) {
        token.image =
          (profile as AuthProfile)?.picture || (profile as AuthProfile)?.avatar_url || null;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.image = (token.image as string) ?? null;
      session.user.name = (token.name as string) ?? "";
      session.user.email = (token.email as string) ?? session.user.email;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/error",
  },
});

export { handler as GET, handler as POST };
