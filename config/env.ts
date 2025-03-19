export const projectName = process.env.PROJECT_NAME ?? 'cryptnews';

export const projectTitle = `${projectName?.charAt(0).toUpperCase()}${projectName?.slice(1)}`;

export const projectDescription =
    process.env.PROJECT_DESCRIPTION ?? 'Cryptocurrency news aggregator using AI';

export const isProduction = process.env.NODE_ENV === 'production';
