'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import GenerateNewsButton from '@/app/[locale]/(front)/(ui)/generate-news-button';
import NewsCard from '@/app/[locale]/(front)/(ui)/news-card';
import { getNews } from '@/app/[locale]/(front)/action';

export default function Home() {
    const t = useTranslations('home');
    const [news, setNews] = useState<string | string[] | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const clearNews = () => {
        setNews(undefined);
    };

    const updateNews = async () => {
        setLoading(true);
        clearNews();
        const res = await getNews();
        setLoading(false);
        if (res.news) {
            setNews(res.news);
            return;
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
