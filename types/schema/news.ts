import { z } from 'zod';

import { newsArraySchema, newsSchema } from '@/schema/news';

export type NewsArray = z.infer<typeof newsArraySchema>;

export type NewsArticle = z.infer<typeof newsSchema>;
