'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useJsonStream } from 'stream-hooks';
import { StartStreamArgs } from 'stream-hooks/dist/types';

import GenerateNewsButton from '@/app/[locale]/(front)/(ui)/generate-news-button';
import NewsCard from '@/app/[locale]/(front)/(ui)/news-card';
import { newsApiRoute } from '@/config/routes';
import { newsSummarySchema } from '@/schema/news';
import { NewsArray } from '@/types/schema/news';

const streamArgs: StartStreamArgs = {
    url: newsApiRoute,
    method: 'GET',
};

export default function Home() {
    const t = useTranslations('home');
    const [news, setNews] = useState<NewsArray | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const { startStream } = useJsonStream({
        schema: newsSummarySchema,
        onReceive: (chunk) => {
            if (chunk.news?.length && chunk.news.length > 0) {
                setLoading(false);
            }
            setNews(chunk.news);
        },
    });

    const clearNews = () => {
        setNews(undefined);
    };

    const updateNews = async () => {
        setLoading(true);
        clearNews();
        try {
            await startStream(streamArgs);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex w-full flex-col items-center justify-center gap-[24px] px-6 md:gap-[32px]">
            <h1 className="text-center text-2xl font-bold md:text-4xl">{t('title')}</h1>
            <GenerateNewsButton callback={updateNews} />
            <NewsCard news={news} isLoading={loading} />
        </div>
    );
}
