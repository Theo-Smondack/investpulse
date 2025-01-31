import { Prisma, PrismaClient } from '@prisma/postgres/client';

const seedClient = new PrismaClient({
    datasourceUrl: process.env.POSTGRES_URL,
});

const defaultUser: Prisma.UserCreateInput = {
    email: 'root@mail.com',
    password: '$2y$10$j3FXQQi5PG5ikg8WDvZ7zeJmU4dITSOqmsRHajElfWcci/moNuJ.q', // == root
};

async function main() {
    //Seed the database
    console.log('Seeding database...');
    await seedClient.user.upsert({
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
        await seedClient.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await seedClient.$disconnect();
        process.exit(1);
    });
