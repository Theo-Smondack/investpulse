'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import GenerateNewsButton from '@/app/[locale]/(front)/(ui)/generate-news-button';
import NewsCard from '@/app/[locale]/(front)/(ui)/news-card';
import { getNews } from '@/app/[locale]/(front)/action';

export default function Home() {
    const t = useTranslations('home');
    const [news, setNews] = useState<string | string[] | undefined>(undefined);

    const clearNews = () => {
        setNews(undefined);
    }

    const updateNews = async () => {
        clearNews();
        const res = await getNews();
        if (res.news) {
            setNews(res.news);
            return;
        }
    }

    return (
        <div className="flex w-full flex-col items-center justify-center md:gap-[32px] gap-[24px] px-6">
            <h1 className="md:text-4xl font-bold text-center text-2xl">{t('title')}</h1>
            <GenerateNewsButton callback={updateNews} />
            <NewsCard news={news} />
        </div>
    );
}
