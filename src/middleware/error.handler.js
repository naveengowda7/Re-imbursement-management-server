import { Prisma }   from '@prisma/client'
import { env }      from '../config/env'

export function errorHandler(
  err,
  req,
  res,
  next
) {

  if (err instanceof AppError) {
    const body = {
      success: false,
      error:   err.message,
    }
    if (err.code) body.code = err.code

    res.status(err.statusCode).json(body)
    return
  }

  if (err instanceof Error) {
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error:   'Invalid token.',
        code:    'INVALID_TOKEN',
      })
      return
    }

    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error:   'Token expired.',
        code:    'TOKEN_EXPIRED',
      })
      return
    }

    if (err.name === 'NotBeforeError') {
      res.status(401).json({
        success: false,
        error:   'Token not yet valid.',
        code:    'TOKEN_NOT_ACTIVE',
      })
      return
    }
  }

  console.error('[Unhandled Error]', err)

  const body = {
    success: false,
    error:   'An unexpected error occurred. Please try again.',
    code:    'INTERNAL_ERROR',
  }

  if (env.isDev && err instanceof Error) {
    body.details = err.stack
  }

  res.status(500).json(body)
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error:   `Route not found: ${req.method} ${req.originalUrl}`,
    code:    'ROUTE_NOT_FOUND',
  })
}