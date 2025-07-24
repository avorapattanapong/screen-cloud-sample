import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function connectToDb() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to the database.');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); // Exit the app if DB connection fails
  }
}

export default prisma;
