import { OpenAI } from 'openai';

import { apiKey, systemPrompt } from '@/config/openai';

export class AIJournalist {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    async summarizeNews(scrapedNews: string | string[]): Promise<string | string[]> {
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
}
