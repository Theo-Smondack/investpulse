import { Prisma, PrismaClient } from '@prisma/client';

// Init new prisma client
const prismaSeedClient = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

const defaultUser: Prisma.UserCreateInput = {
    email: 'root@mail.com',
    password: '$2y$10$j3FXQQi5PG5ikg8WDvZ7zeJmU4dITSOqmsRHajElfWcci/moNuJ.q', // == root
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
