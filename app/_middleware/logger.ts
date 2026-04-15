import { NextRequest } from 'next/server'

/**
 * Request Logger Middleware
 * Logs all API requests with method, path, and execution time
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS]

interface LogEntry {
  timestamp: string
  level: LogLevel
  method: string
  path: string
  status?: number
  duration?: number
  error?: string
}

class RequestLogger {
  private requestStartTimes: Map<string, number> = new Map()

  logRequest(request: NextRequest): string {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    this.requestStartTimes.set(id, Date.now())

    const { method, url } = request
    const path = new URL(url).pathname

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      method,
      path,
    }

    console.log(`[${logEntry.timestamp}] ${method} ${path}`)

    return id
  }

  logResponse(id: string, status: number): void {
    const startTime = this.requestStartTimes.get(id)
    if (!startTime) return

    const duration = Date.now() - startTime
    this.requestStartTimes.delete(id)

    const level = status >= 400 ? 'WARN' : 'INFO'
    console.log(`[${new Date().toISOString()}] Response: ${status} (${duration}ms)`)
  }

  logError(id: string, error: Error | unknown, custom?: Partial<LogEntry>): void {
    const message = error instanceof Error ? error.message : String(error)

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      method: custom?.method || 'UNKNOWN',
      path: custom?.path || 'UNKNOWN',
      error: message,
    }

    console.error(`[${logEntry.timestamp}] ERROR: ${message}`, error)
  }
}

export const logger = new RequestLogger()
