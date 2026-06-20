import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      cineRank?: string;
      bio?: string;
    } & DefaultSession["user"];
  }
}
