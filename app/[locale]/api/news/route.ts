import { NextResponse } from 'next/server';
import { OAIStream } from 'zod-stream';

import { AIJournalist } from '@/lib/classes/AIJournalist';

export async function GET() {
    const aiJournalist = new AIJournalist();
    const stream = await aiJournalist.summarizeNews();

    return new NextResponse(
        OAIStream({
            res: stream,
        }),
    );
}
