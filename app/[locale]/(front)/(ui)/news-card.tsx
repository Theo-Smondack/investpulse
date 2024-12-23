import React, { FC } from 'react';
import Typewriter from 'typewriter-effect';

import { Card, CardContent } from '@/components/ui/card';

interface NewsCardProps {
    news?: string | string[];
}

const NewsCard: FC<NewsCardProps> = ({ news }) => {
    return (
        <Card className="w-full p-5 h-[60vh] md:w-9/12 2xl:w-1/2 overflow-auto">
            <CardContent>
                {news && (
                    <Typewriter
                        options={{
                            wrapperClassName: 'text-lg',
                            delay: 2,
                        }}
                        onInit={(typewriter) => {
                            typewriter
                                .start()
                                .typeString(typeof news === 'string' ? news : news.join('<br><br>'))
                        }}
                    />
                    )
                }
            </CardContent>
        </Card>
    );
};

export default NewsCard;
