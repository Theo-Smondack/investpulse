import { z } from 'zod';

export const newsSummarySchema = z.object({
    news: z.array(
        z.object({
            title: z.string(),
            content: z.string(),
        }),
    ),
});

export const newsArraySchema = newsSummarySchema.shape.news;

export const newsSchema = newsArraySchema.element;
