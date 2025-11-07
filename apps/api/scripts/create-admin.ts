import { prisma } from '../src/config/database';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    const email = 'admin@botpe.com';
    const password = 'Ramborau46**';
    const name = 'BotPe Admin';

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log('User already exists, updating to SUPERADMIN...');
      await prisma.user.update({
        where: { email },
        data: {
          role: 'SUPERADMIN',
          organizationId: null,
        },
      });
      console.log('✅ User updated to SUPERADMIN');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: true,
        role: 'SUPERADMIN',
        organizationId: null,
      },
    });

    // Create account for Better-Auth
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: 'credential',
        password: hashedPassword,
      },
    });

    console.log('✅ Superadmin user created successfully');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User ID: ${user.id}`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
