import { z } from 'zod';

export const SessionInfoSchema = z.object({ id: z.string(), email: z.string().email(), image: z.string().url() });
export type TSessionInfo = z.infer<typeof SessionInfoSchema>;

export const SESSION_QUERY_KEY = 'session';
export const SESSION_QUERY_STALE_TIME = 1000 * 60 * 60 * 24;
