import { OpenAI } from 'openai';

import { apiKey } from '@/config/openai';
import { scrapeUrls } from '@/config/puppeteer';
import { getLocaleCookie } from '@/i18n/cookies';
import { getSystemPrompt } from '@/lib/openai';

export class AIJournalist {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    async summarizeNews(scrapedNews: string | string[]): Promise<string | string[]> {
        const article = await this.writeArticle(scrapedNews);
        return [article, this.generateSourcesUrlList()].join('\n');
    }

    private async writeArticle(scrapedNews: string | string[]){
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

    private toArray(content: string | string[]): string[] {
        return Array.isArray(content) ? content : [content];
    }

    private generateSourcesUrlList(): string {
        return `<ul>${
            scrapeUrls.map(url => {
                const { origin, hostname } = new URL(url);
                return `<li><a href="${origin}" target="_blank" rel="noopener noreferrer">${hostname}</a></li>`;
            }).join('')
        }</ul>`;
    }
}
