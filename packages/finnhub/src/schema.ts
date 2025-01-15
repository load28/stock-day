import { z } from 'zod';

export const NewsDataSchema = z.object({
  s: z.string(),
  content: z.string()
});

export const TradeDataSchema = z.object({
  p: z.number(),
  s: z.string(),
  t: z.number(),
  v: z.number(),
  c: z.array(z.string())
});
