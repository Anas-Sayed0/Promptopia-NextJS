import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorization: {
      //   params: {
      //     response_type: "code",
      //     redirect_uri: "http://localhost:3000/api/auth/callback/google",
      //   },
      // },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        console.log("Connected to DB.");

        console.log(`Finding user with email ${profile.email}...`);
        const userExists = await User.findOne({
          email: profile.email,
        }).maxTimeMS(600000);
        console.log(userExists ? "User found." : "User not found.");

        if (!userExists) {
          console.log("Creating new user...");
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "").toLowerCase(),
            image: profile.picture,
          });
          console.log("New user created.");
        }

        return true;
      } catch (error) {
        console.log("Error in signIn function:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
