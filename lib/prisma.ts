/**
 * Prisma Client Singleton
 * 
 * Mục đích:
 * - Tạo một instance duy nhất của PrismaClient
 * - Tránh tạo quá nhiều database connections trong development
 * - Sử dụng trong API routes để query database
 * 
 * Cách dùng:
 * import { prisma } from '@/lib/prisma'
 * const users = await prisma.user.findMany()
 */

// import { PrismaClient } from '@/lib/generated/prisma'

// // Prevent multiple instances of Prisma Client in development
// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//   })

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma
// }

// export default prisma
