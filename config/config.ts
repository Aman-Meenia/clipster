import { z } from "zod";

import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  POSTGRES_URL: z.string().min(1, "POSTGRES_URL is required"),
  POSTGRES_POOL_MAX: z.coerce.number().int().positive().default(5),
  POSTGRES_POOL_IDLE_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  POSTGRES_POOL_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  ACCESS_TOKEN_EXPIRY: z.string().min(1, "ACCESS_TOKEN_EXPIRY is required"),
  APP_URL: z.string().default("http://localhost:3000"),
  SMTP_HOST: z.string().default("smtp.ethereal.email"),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  // Cloudflare R2 — get from Cloudflare Dashboard > R2 > Manage R2 API Tokens
  // These default to "" so builds/prisma-generate don't crash when unconfigured.
  // The R2 service constructor throws a clear error at runtime if any are missing.
  R2_ACCOUNT_ID: z.string().default(""),
  R2_ACCESS_KEY_ID: z.string().default(""),
  R2_SECRET_ACCESS_KEY: z.string().default(""),
  R2_BUCKET_NAME: z.string().default(""),
  R2_PUBLIC_URL: z.string().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error);
  throw new Error("Invalid environment variables. Check server logs.");
}

const config = parsed.data;

export type Config = z.infer<typeof envSchema>;
export default config;
