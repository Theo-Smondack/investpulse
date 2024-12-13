import { Browser } from 'puppeteer-core';

import { NewsExtractionStrategyFactory } from '@/lib/classes/NewsExtractionStrategyFactory';
import { NewsArticle, NewsScraperOptions } from '@/types/classes/NewsScraper';

export class NewsScraper {
    private strategyFactory: NewsExtractionStrategyFactory;

    constructor(
        private browserService: Browser,
        strategyFactory?: NewsExtractionStrategyFactory,
    ) {
        this.strategyFactory = strategyFactory || new NewsExtractionStrategyFactory();
    }

    async scrapeNews(options: NewsScraperOptions): Promise<NewsArticle[]> {
        const strategyKey = this.extractStrategyKey(options.url);
        const extractionStrategy = this.strategyFactory.getStrategy(strategyKey);

        const articles: NewsArticle[] = [];
        const page = await this.browserService.newPage();

        try {
            await page.goto(options.url, {
                waitUntil: 'networkidle0',
                timeout: options.timeout ?? 30000,
            });

            const articleUrls = await extractionStrategy.extractArticleUrls(page);

            for (const url of articleUrls.slice(0, options.maxArticles ?? 4)) {
                const articlePage = await this.browserService.newPage();
                try {
                    await articlePage.goto(url, {
                        waitUntil: 'networkidle0',
                        timeout: options.timeout ?? 30000,
                    });

                    const content = await extractionStrategy.extractArticleContent(articlePage);
                    articles.push({ url, content });
                } catch (error) {
                    console.error(`Failed to scrape ${url}:`, error);
                } finally {
                    await articlePage.close();
                }
            }

            return articles;
        } catch (error) {
            console.error('Failed to scrape data:', error);
            throw error;
        } finally {
            await page.close();
        }
    }

    private extractStrategyKey(url: string): string {
        const hostname = new URL(url).hostname;
        if (hostname.includes('coinacademy')) return 'coinacademy';
        throw new Error(`No strategy found for URL: ${url}`);
    }
}
