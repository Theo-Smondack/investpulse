'use server';

import { signOut } from '@/auth';
import { DEFAULT_LOGOUT_REDIRECT } from '@/config/routes';
import { AIJournalist } from '@/lib/classes/AIJournalist';

export async function logout() {
    await signOut({
        redirectTo: DEFAULT_LOGOUT_REDIRECT,
    });
}

interface GetNewsResponse {
    news?: string | string[];
    error?: string;
}

export async function getNews(): Promise<GetNewsResponse> {
    try {
        const aiJournalist = new AIJournalist();
        const news = await aiJournalist.summarizeNews();
        return { news };
    } catch (error) {
        console.error(error);
        return {
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
