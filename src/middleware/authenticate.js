import jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { env } from '../config/env'
import { AppError } from './error.handler'


export async function authenticate(
  req,
  res,
  next
) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided.', 401, 'NO_TOKEN')
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      throw new AppError('Malformed authorization header.', 401, 'INVALID_TOKEN')
    }

    let payload
    try {
      payload = jwt.verify(token, env.JWT_SECRET)
    } catch (err) {
      throw err
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        companyId: true,
        role: true,
        email: true,
        name: true,
        isActive: true,
      },
    })

    if (!user) {
      throw new AppError('User not found.', 401, 'USER_NOT_FOUND')
    }

    if (!user.isActive) {
      throw new AppError(
        'Your account has been deactivated. Please contact your admin.',
        403,
        'ACCOUNT_DEACTIVATED'
      )
    }

    req.user = {
      id: user.id,
      companyId: user.companyId,
      role: user.role,
      email: user.email,
      name: user.name,
    }

    next()
  } catch (err) {
    next(err)
  }
}