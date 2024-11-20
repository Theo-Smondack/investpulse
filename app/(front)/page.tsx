'use client';
import { useState } from 'react';

import NewsCard from '@/app/(front)/(ui)/news-card';
import { getPageTitle } from '@/app/(front)/action';
import { Button } from '@/components/ui/button';

export default function Home() {
    const [news, setNews] = useState<string | string[] | undefined>(undefined);
    const onClickGenerate = async () => {
        const res = await getPageTitle();
        if (res.result) {
            setNews(res.result);
            return;
        }
    }
    return (
        <div className="flex w-full flex-col items-center justify-center md:gap-[32px] gap-[24px] px-6">
            <h1 className="md:text-4xl font-bold text-center text-2xl">Click on generate to get news about cryptocurrency market !</h1>
            <Button size="lg" className="md:text-2xl text-xl" onClick={onClickGenerate}>Generate</Button>
            <NewsCard news={news} />
        </div>
    );
}
