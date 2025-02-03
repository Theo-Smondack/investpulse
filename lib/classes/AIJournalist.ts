import { OpenAI } from 'openai';

import { apiKey } from '@/config/openai';
import { scrapeUrls } from '@/config/puppeteer';
import { getLocaleCookie } from '@/i18n/cookies';
import { getSystemPrompt } from '@/lib/openai';
import { getAllArticles } from '@/services/article';

export class AIJournalist {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    async summarizeNews(): Promise<string | string[]> {
        const articlesContent = await this.getArticlesContent();
        const article = await this.writeArticle(articlesContent);
        return [article, this.generateSourcesUrlList()].join('<br>');
    }

    private async writeArticle(scrapedNews: string | string[]) {
        const locale = getLocaleCookie();
        const systemPrompt = getSystemPrompt(locale);
        scrapedNews = this.toArray(scrapedNews);
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: scrapedNews.join('\n') },
                ],
                temperature: 0.7,
            });
            return completion.choices[0].message.content ?? scrapedNews;
        } catch (error) {
            console.error('Failed to summarize news:', error);
            return scrapedNews;
        }
    }

    private async getArticlesContent(): Promise<string[]> {
        const articles = await getAllArticles();
        return Array.from(articles, (article) => article.content);
    }

    private toArray(content: string | string[]): string[] {
        return Array.isArray(content) ? content : [content];
    }

    private generateSourcesUrlList(): string {
        return scrapeUrls
            .map((url) => {
                const { origin, hostname } = new URL(url);
                return `<span><a href="${origin}" target="_blank" rel="noopener noreferrer">${hostname}</a></span>`;
            })
            .join('<br>')
            .slice(0, -4);
    }
}
