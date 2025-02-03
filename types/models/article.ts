import { Prisma } from '@prisma/mongo/client';

const articlePrisma = Prisma.validator<Prisma.ArticleDefaultArgs>()({
    select: { content: true, url: true, provider: true },
});

export type getArticlesRsp = Prisma.ArticleGetPayload<typeof articlePrisma>;
