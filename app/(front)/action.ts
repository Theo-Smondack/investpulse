'use server';

import { signOut } from '@/auth';
import { DEFAULT_LOGOUT_REDIRECT } from '@/config/routes';
import { getBrowser } from '@/lib/puppeteer';

export async function logout() {
    await signOut({
        redirectTo: DEFAULT_LOGOUT_REDIRECT,
    });
}

interface GetPageTitleResponse {
    result?: string;
    error?: string;
}

export async function getPageTitle(): Promise<GetPageTitleResponse> {
    try {
        const browser = await getBrowser();
        const page = await browser.newPage();

        try {
            await page.goto('https://example.com', {
                waitUntil: 'networkidle0',
                timeout: 30000,
            });

            const pageTitle = await page.title();

            return { result: pageTitle };
        } finally {
            // Always close the page, but keep the browser instance
            await page.close();
        }
    } catch (error) {
        console.error('Failed to scrape data:', error);
        // Convert the error to a string
        return { error: error?.toString() };
    }
}