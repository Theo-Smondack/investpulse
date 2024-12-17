'use server';

import { signOut } from '@/auth';
import { scrapeUrls } from '@/config/puppeteer';
import { DEFAULT_LOGOUT_REDIRECT } from '@/config/routes';
import { NewsScraper } from '@/lib/classes/NewsScraper';
import { getBrowser } from '@/lib/puppeteer';

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
        const browserService = await getBrowser();
        const newsScraper = new NewsScraper(browserService);

        const articles = await newsScraper.scrapeAll(scrapeUrls);

        const news = Array.from(articles, article => article.content.join('\n'));

        return { news };
    } catch (error) {
        console.error('News scraping failed:', error);
        return {
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
