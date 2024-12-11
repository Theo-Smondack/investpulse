'use client';
import { useState } from 'react';

import GenerateNewsButton from '@/app/(front)/(ui)/generate-news-button';
import NewsCard from '@/app/(front)/(ui)/news-card';
import { getPageTitle } from '@/app/(front)/action';

export default function Home() {
    const [news, setNews] = useState<string | string[] | undefined>(undefined);

    const clearNews = () => {
        setNews(undefined);
    }

    const updateNews = async () => {
        clearNews();
        const res = await getPageTitle();
        if (res.title) {
            setNews(res.title);
            return;
        }
    }

    return (
        <div className="flex w-full flex-col items-center justify-center md:gap-[32px] gap-[24px] px-6">
            <h1 className="md:text-4xl font-bold text-center text-2xl">Click on generate to get news about cryptocurrency market !</h1>
            <GenerateNewsButton callback={updateNews} />
            <NewsCard news={news} />
        </div>
    );
}
