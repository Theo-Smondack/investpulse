'use client';

import { FC } from 'react';

import Article from '@/app/[locale]/(front)/(ui)/article';
import LoadingTypewriter from '@/app/[locale]/(front)/(ui)/loading-typewriter';
import { Card, CardContent } from '@/components/ui/card';
import { NewsArray } from '@/types/schema/news';

interface NewsCardProps {
    news?: NewsArray;
    isLoading?: boolean;
}

const NewsCard: FC<NewsCardProps> = ({ news, isLoading }) => {
    return (
        <Card className="h-[60vh] w-full overflow-auto p-5 md:w-9/12 2xl:w-1/2">
            <CardContent>
                {isLoading && <LoadingTypewriter />}
                {news &&
                    news.map((article, index) => {
                        return <Article article={article} key={index} />;
                    })}
            </CardContent>
        </Card>
    );
};

export default NewsCard;
