import { PrismaClient } from '@prisma/client'


function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  })
}

const prisma = createPrismaClient()


export default prisma