import { AppError } from './error.handler'
import { ROLES } from '../config/constants'

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError(
          'authenticate middleware must run before authorize.',
          500,
          'MIDDLEWARE_ORDER_ERROR'
        )
      }

      const userRole = req.user.role

      if (!allowedRoles.includes(userRole)) {
        throw new AppError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
          403,
          'INSUFFICIENT_PERMISSIONS'
        )
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

export const adminOnly = authorize(ROLES.ADMIN)

export const managerOrAdmin = authorize(ROLES.ADMIN, ROLES.MANAGER)

export const allRoles = authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE)

// A separate check — ensures a user can only access resources
// belonging to their own company.
export function sameCompany(
  req,
  _res,
  next
) {
  try {
    const requestedCompanyId =
      req.params.companyId ||
      req.body?.companyId  ||
      req.query?.companyId

    if (
      requestedCompanyId &&
      requestedCompanyId !== req.user.companyId &&
      req.user.role !== ROLES.ADMIN
    ) {
      throw new AppError(
        'You do not have access to this company\'s data.',
        403,
        'COMPANY_ISOLATION_VIOLATION'
      )
    }

    next()
  } catch (err) {
    next(err)
  }
}

// Self or Admin guard
// Ensures a user can only access their own resource unless Admin
export function selfOrAdmin(
  req,
  res,
  next
) {
  try {
    const targetUserId = req.params.userId || req.params.id

    const isSelf  = targetUserId === req.user.id
    const isAdmin = req.user.role === ROLES.ADMIN

    if (!isSelf && !isAdmin) {
      throw new AppError(
        'You can only access your own resources.',
        403,
        'ACCESS_DENIED'
      )
    }

    next()
  } catch (err) {
    next(err)
  }
}