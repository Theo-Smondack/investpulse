'use server';

import { signOut } from '@/auth';
import { DEFAULT_LOGOUT_REDIRECT } from '@/config/routes';
import { AIJournalist } from '@/lib/classes/AIJournalist';
import { NewsScraper } from '@/lib/classes/NewsScraper';

export async function logout() {
    await signOut({
        redirectTo: DEFAULT_LOGOUT_REDIRECT,
    });
}

interface GetNewsResponse {
    news?: string | string[];
    error?: string;
}

export async function getNews(): Promise<GetNewsResponse> {
    try {
        const newsScraper = new NewsScraper();
        const aiJournalist = new AIJournalist();

        const articles = await newsScraper.scrape();

        const scrapedNews: string[] | string = Array.from(articles, (article) =>
            article.content.join('\n'),
        );

        const news = await aiJournalist.summarizeNews(scrapedNews);

        return { news };
    } catch (error) {
        console.error(error);
        return {
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
