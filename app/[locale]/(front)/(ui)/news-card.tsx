'use client';

import { FC } from 'react';

import LoadingTypewriter from '@/app/[locale]/(front)/(ui)/loading-typewriter';
import { Card, CardContent } from '@/components/ui/card';
import CustomTypewriter from '@/components/ui/custom-typewriter';

interface NewsCardProps {
    news?: string | string[];
    isLoading?: boolean;
}

const NewsCard: FC<NewsCardProps> = ({ news, isLoading }) => {
    const formattedNews = typeof news === 'string' ? news : news?.join('<br><br>');
    return (
        <Card className="h-[60vh] w-full overflow-auto p-5 md:w-9/12 2xl:w-1/2">
            <CardContent>
                {isLoading ? (
                    <LoadingTypewriter />
                ) : (
                    news && (
                        <CustomTypewriter
                            typeString={formattedNews}
                            delay={2}
                            hideCursorOnComplete
                        />
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default NewsCard;
