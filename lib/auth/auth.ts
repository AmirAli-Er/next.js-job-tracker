import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoDatabase, getMongoClient } from "@/lib/db";

const database = await getMongoDatabase();
const client = await getMongoClient();

export const auth = betterAuth({
  database: mongodbAdapter(database, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh once per day
  },
});
