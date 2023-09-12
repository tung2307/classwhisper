import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function cleanUpCookies() {
  try {
    const sevenDaysAgo = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000);

    await prisma.cookieConsent.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });
    console.log("Successfully cleaned up expired cookies.");
  } catch (error) {
    console.error("Error cleaning up cookies:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanUpCookies();

export {};
