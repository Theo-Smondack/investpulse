export interface NewsScraperOptions {
    url: string;
    maxArticles?: number;
    timeout?: number;
}

export interface NewsArticle {
    url: string;
    content: string[];
}
