import { OpenAI } from 'openai';
import { withResponseModel } from 'zod-stream';

import { apiKey } from '@/config/openai';
import { getLocaleCookie } from '@/i18n/cookies';
import { getSystemPrompt } from '@/lib/openai';
import { newsSummarySchema } from '@/schema/news';
import { getAllArticles } from '@/services/article';

export class AIJournalist {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    async summarizeNews() {
        const articlesContent = await this.getArticlesContent();
        return await this.writeArticle(articlesContent);
    }

    private async writeArticle(content: string[]) {
        const locale = getLocaleCookie();
        const systemPrompt = getSystemPrompt(locale);
        try {
            const params = withResponseModel({
                response_model: {
                    schema: newsSummarySchema,
                    name: 'news',
                },
                params: {
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt,
                        },
                        {
                            role: 'user',
                            content: content.join('\n'),
                        },
                    ],
                    temperature: 0.7,
                    stream: true,
                },
                mode: 'TOOLS',
            });

            return await this.openai.chat.completions.create(params);
        } catch (error) {
            console.error('Failed to summarize news:', error);
            throw error;
        }
    }

    private async getArticlesContent(): Promise<string[]> {
        const articles = await getAllArticles();
        return Array.from(articles, (article) => article.content);
    }
}
