import chromium from '@sparticuz/chromium-min';
import puppeteer, { Browser } from 'puppeteer-core';

import { executablePath } from '@/config/puppeteer';

let browserInstance: Browser | null = null;

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;
await chromium.font(
    'https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf',
);

async function getBrowser(): Promise<Browser> {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            args: [
                ...chromium.args,
                '--incognito',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--hide-scrollbars',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(executablePath),
            headless: chromium.headless,
        });

        // Handle browser disconnection
        browserInstance.on('disconnected', () => {
            browserInstance = null;
        });
    }
    return browserInstance;
}

// Cleanup function
export async function closeBrowser(): Promise<void> {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
    }
}

// Handle process termination
process.on('exit', closeBrowser);
process.on('SIGINT', closeBrowser);
process.on('SIGTERM', closeBrowser);

export { getBrowser };
