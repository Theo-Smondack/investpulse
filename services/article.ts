import { prismaMongo } from '@/prisma/prisma';
import { getArticlesRsp } from '@/types/models/article';

export async function getAllArticles(): Promise<getArticlesRsp[]> {
    return prismaMongo.article.findMany();
}
