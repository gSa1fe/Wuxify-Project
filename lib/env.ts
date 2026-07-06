import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
})

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format())
  throw new Error("Invalid environment variables")
}

export const env = parsed.data
