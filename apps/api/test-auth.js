const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestOrganization() {
  try {
    // Check if org already exists
    const existing = await prisma.organization.findUnique({
      where: { slug: 'test-org' }
    });

    if (existing) {
      console.log('✅ Organization already exists:', existing.id);
      return existing.id;
    }

    // Create new organization
    const org = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        slug: 'test-org',
        plan: 'FREE',
      },
    });

    console.log('✅ Created organization:', org.id);
    return org.id;
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrganization();
