'use client';

import { FC } from 'react';

import { NewsArticle } from '@/types/schema/news';

interface ArticleProps {
    article: NewsArticle;
}

const Article: FC<ArticleProps> = ({ article }) => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p>{article.content}</p>
        </div>
    );
};

export default Article;
