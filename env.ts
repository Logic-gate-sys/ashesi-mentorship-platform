import { config as customEnvConfig } from 'custom-env'
import { z } from 'zod'

// ── Load Environment Variables ────────────────────────────────────────

/**
 * Load environment variables based on APP_STAGE
 * custom-env will load .env.{APP_STAGE} file
 * Falls back to .env if stage-specific file doesn't exist
 * 
 * File precedence (highest to lowest):
 * 1. .env.{APP_STAGE} (e.g., .env.production, .env.dev, .env.test)
 * 2. .env (default)
 */
process.env.APP_STAGE = process.env.VITEST ? 'test' : (process.env.APP_STAGE || 'dev')

// Load the appropriate .env file based on APP_STAGE
customEnvConfig({
  path: process.cwd(),
  env: process.env.APP_STAGE,
})

// ── Environment Validation Schema ─────────────────────────────────────

export const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
  APP_STAGE: z.enum(['production', 'dev', 'test']).default('dev'),
  // Prisma PostgreSQL URL validation
  DATABASE_URL: z.string().url().regex(/^postgresql:\/\//, "DATABASE_URL must be a valid Postgres connection string"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().min(12).default(12),
  BECRYPT_ROTATE: z.coerce.number().min(10).max(12).default(10),
})

// Export type for TypeScript support
export type Env = z.infer<typeof envSchema>

// ── Parse and Validate Environment Variables ──────────────────────────

let env: Env

try {
  // Validate all environment variables against schema
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:')
    console.log(JSON.stringify(e.flatten().fieldErrors, null, 2))

    // Log all issues with their paths and messages
    e.issues.forEach((err) => {
      const path = err.path.join('.')
      console.error(`  ${path}: ${err.message}`)
    })

    process.exit(1)
  }
  // Re-throw if error is not from Zod validation
  throw e
}

// ── App Stage Helpers ─────────────────────────────────────────────────

/**
 * Check if running in production
 */
export const isProd = () => env.APP_STAGE === 'production'

/**
 * Check if running in development
 */
export const isDev = () => env.APP_STAGE === 'dev'

/**
 * Check if running in test mode
 */
export const isTest = () => env.APP_STAGE === 'test'

// ── Export ────────────────────────────────────────────────────────────

export { env }
