import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // logging credentials for debugging
          console.log("Received credentials:", credentials);

          // Validate input
          if (!credentials.email || !credentials.password) {
            throw new Error('Missing email or password');
          }

          // finding the user in the database
          const user = await prisma.userInfo.findUnique({
            where: { email: credentials.email },
          });

          // checking if the user exists and the password matches
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            // Return the user along with mode
            return { 
              id: user.id,
              username: user.username,
              email: user.email,
              mode: user.mode // Include the mode field
            };
          }

          // returning null if authentication fails
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    // Modify the session callback to include mode
    async session({ session, user }) {
      session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        mode: user.mode, // Add mode to session
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: "/auth/error",
  },
  session: {
    jwt: true,
  },
});

export { handler as POST, handler as GET };
