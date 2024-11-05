import React, { FC } from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface NewsCardProps {
    news: string;
}

const NewsCard: FC<NewsCardProps> = ({ news }) => {
    return (
        <Card className="min-h-[0vh] w-full p-5 md:min-h-[60vh] md:w-9/12 2xl:w-1/2">
            <CardContent>{news}</CardContent>
        </Card>
    );
};

export default NewsCard;