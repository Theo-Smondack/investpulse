import './globals.css';

import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Toaster } from '@/components/ui/toaster';
import { projectDescription, projectTitle } from '@/config/env';
import { navigation } from '@/i18n/navigation';
import { LayoutProps } from '@/types';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: projectTitle,
    description: projectDescription,
};

export default async function RootLayout({ children, params : { locale } }: LayoutProps) {
    if (!navigation.locales.includes(locale as never)) {
        notFound();
    }

    const messages = await getMessages();
    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <main>{children}</main>
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
