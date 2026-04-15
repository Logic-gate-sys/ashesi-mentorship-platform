import { z } from 'zod'

process.env.APP_STAGE = process.env.VITEST ? 'test' : (process.env.APP_STAGE || 'dev')

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

export type Env = z.infer<typeof envSchema>

let env: Env

try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error(' Invalid environment variables:')
    console.log(JSON.stringify(e.flatten().fieldErrors, null, 2))

    // Log all issues with their paths and messages
    e.issues.forEach((err) => {
      const path = err.path.join('.')
      console.error(`  ${path}: ${err.message}`)
    })

    process.exit(1)
  }
  throw e
}

export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTest = () => env.APP_STAGE === 'test'

export { env }
