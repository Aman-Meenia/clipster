import { z } from "zod";

import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});


const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  POSTGRES_URL: z.string().min(1, "POSTGRES_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  ACCESS_TOKEN_EXPIRY: z.string().min(1, "ACCESS_TOKEN_EXPIRY is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error);
  throw new Error("Invalid environment variables. Check server logs.");
}

const config = parsed.data;

export type Config = z.infer<typeof envSchema>;
export default config;
