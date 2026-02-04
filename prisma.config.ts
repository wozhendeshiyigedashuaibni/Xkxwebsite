// Prisma 7.x compatible configuration
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || '',
      directUrl: process.env.DIRECT_URL || '',
    },
  },
}
