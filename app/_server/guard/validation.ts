import { NextRequest, NextResponse } from "next/server"
import { ZodObject } from "zod"

export function validateRequestBody(schema: ZodObject) {
  return async (req: NextRequest) => {
    const body = await req.json()

    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
          {
              error: 'Invalid request body',
              details: result.error.issues.map((issue) => ({
                  path: issue.path.join('.'),
                  message: issue.message
              }))
          },
        { status: 400 }
      )
    };
    (req as any).validatedBody = result.data
  }
}

export function validateRequestQuery(schema: ZodObject) {
  return async (req: NextRequest) => {
    const query = Object.fromEntries(req.nextUrl.searchParams)

    const result = schema.safeParse(query)

    if (!result.success) {
     return NextResponse.json(
          {
              error: 'Invalid request queries',
              details: result.error.issues.map((issue) => ({
                  path: issue.path.join('.'),
                  message: issue.message
              }))
          },
        { status: 400 }
      )
      };

      (req as any).validatedQuery = result.data
  }
}


export function validateRequestParams (schema: ZodObject) {
  return async (req:NextRequest,) => {
    const result = schema.safeParse((req as any).params)

    if (!result.success) {
      return NextResponse.json(
          {
              error: 'Invalid request params',
              details: result.error.issues.map((issue) => ({
                  path: issue.path.join('.'),
                  message: issue.message
              }))
          },
        { status: 400 }
      )
    }

    (req as any).validatedParams = result.data
  }
}