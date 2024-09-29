import { Prisma, PrismaClient } from '@prisma/client';

// Init new prisma client
const prismaSeedClient = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set');
}

const defaultUser: Prisma.UserCreateInput = {
    email: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
};

async function main() {
    //Seed the database
    console.log('Seeding database...');
    await prismaSeedClient.user.upsert({
        where: { email: defaultUser.email },
        update: {
            password: defaultUser.password,
        },
        create: defaultUser,
    });
    console.log('Database seeded');
}
main()
    .then(async () => {
        await prismaSeedClient.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prismaSeedClient.$disconnect();
        process.exit(1);
    });
