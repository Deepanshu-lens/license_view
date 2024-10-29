import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return json({
        status: 'ok',
        message: 'Server is up and running',
        timestamp: new Date().toISOString()
    });
};