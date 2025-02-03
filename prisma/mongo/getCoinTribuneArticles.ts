import { PrismaClient } from '@prisma/mongo/client';

import * as fs from 'node:fs';

const mongoClient = new PrismaClient({
    datasourceUrl: process.env.MONGO_URL,
});

async function main() {
    //Seed the database
    console.log('Fetching articles...');
    const articles = await mongoClient.article.findMany({
        select: {
            url: true,
            content: true,
            provider: true,
        },
        where: {
            provider: 'coinacademy',
        },
    });
    fs.writeFileSync('articles.json', JSON.stringify(articles, undefined, 4));
    console.log('Articles fetched');
}
main()
    .then(async () => {
        await mongoClient.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await mongoClient.$disconnect();
        process.exit(1);
    });
