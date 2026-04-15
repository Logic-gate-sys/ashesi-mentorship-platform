import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { errorResponse, validationErrorResponse, serverErrorResponse } from '@/app/_utils/api-response'
import { logger } from './logger'

/**
 * Safe Request Handler Wrapper
 * Wraps route handlers to provide consistent error handling and logging
 */

export type RouteHandler = (request: NextRequest) => Promise<NextResponse>

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, string>) {
    super(400, message, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message)
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict') {
    super(409, message)
    this.name = 'ConflictError'
  }
}

/**
 * Wraps a route handler with automatic error handling and logging
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest): Promise<NextResponse> => {
    const requestId = logger.logRequest(request)

    try {
      const response = await handler(request)

      // Extract status code from response
      const status = response.status
      logger.logResponse(requestId, status)

      return response
    } catch (error) {
      logger.logError(requestId, error, {
        method: request.method,
        path: new URL(request.url).pathname,
      })

      // Handle custom API errors
      if (error instanceof ApiError) {
        return errorResponse(error.message, {
          status: error.status,
          details: error.details as Record<string, string>,
        })
      }

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return validationErrorResponse(error)
      }

      // Handle generic errors
      const message = error instanceof Error ? error.message : 'Internal server error'
      return serverErrorResponse(error as Error, message)
    }
  }
}
