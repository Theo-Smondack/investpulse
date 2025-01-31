import { PrismaClient as MongoPrismaClient } from '@prisma/mongo/client';
import { PrismaClient as PostgresPrismaClient } from '@prisma/postgres/client';

const postgresClientSingleton = () => {
    return new PostgresPrismaClient();
};

const mongoClientSingleton = () => {
    return new MongoPrismaClient();
};

declare const globalThis: {
    postgresGlobal: ReturnType<typeof postgresClientSingleton>;
    mongoGlobal: ReturnType<typeof mongoClientSingleton>;
} & typeof global;

const prismaPostgres = globalThis.postgresGlobal ?? postgresClientSingleton();
const prismaMongo = globalThis.mongoGlobal ?? mongoClientSingleton();

export { prismaPostgres, prismaMongo };

if (process.env.NODE_ENV !== 'production') globalThis.postgresGlobal = prismaPostgres;
