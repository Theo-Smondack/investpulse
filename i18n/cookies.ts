import { cookies } from 'next/headers';

import { defaultLocale } from '@/i18n/navigation';

export function getLocaleCookie() {
    return cookies().get('NEXT_LOCALE')?.value ?? defaultLocale;
}
