import { z } from 'zod';
import { last } from 'es-toolkit';
import { createSingletonSubscriptionHandler, SubscriptionManager } from '@stock-day/utils/subscritpion-manager';
import { NewsDataSchema, TradeDataSchema } from './schema';
import { createWs, SocketHandler } from '@stock-day/utils/ws-observer';

const apiKey = '';
const wsManager = createWs(`ws://ws.finnhub.io?token=${apiKey}`);

export const createFinnHubNews = () => {
  const subscriptionManager = new SubscriptionManager<z.infer<typeof NewsDataSchema>>();
  const SocketDataSchema = z.object({ type: z.string(), data: NewsDataSchema });

  const newsHandler: SocketHandler<z.infer<typeof NewsDataSchema>> = {
    handleMessage: (data) => {
      const result = SocketDataSchema.safeParse(data);
      if (!result.success) return null;
      return result.data.data;
    }
  };

  const unsubscribeSocket = wsManager.subscribe(newsHandler, (newsData) => {
    if (subscriptionManager.hasSubscribers(newsData.s)) {
      subscriptionManager.notify(newsData.s, newsData);
    }
  });

  const subscribe = createSingletonSubscriptionHandler({
    subscriptionManager,
    sendFn: (symbol: string) => wsManager.send(JSON.stringify({ type: 'subscribe-news', symbol })),
    closeFn: (symbol: string) => wsManager.send(JSON.stringify({ type: 'unsubscribe-news', symbol }))
  });

  return {
    subscribe,
    unsubscribe: () => {
      unsubscribeSocket();
      subscriptionManager.allRemoveSubscriber();
    }
  };
};

export const createFinnHubTrade = () => {
  const subscriptionManager = new SubscriptionManager<z.infer<typeof TradeDataSchema>>();
  const SocketDataSchema = z.object({ type: z.string(), data: z.array(TradeDataSchema) });

  const tradeHandler: SocketHandler<z.infer<typeof TradeDataSchema>[]> = {
    handleMessage: (data) => {
      const result = SocketDataSchema.safeParse(data);
      if (!result.success) return null;
      return result.data.data;
    }
  };

  const unsubscribeSocket = wsManager.subscribe(tradeHandler, (tradeData) => {
    const lastItem = last(tradeData);
    if (lastItem && subscriptionManager.hasSubscribers(lastItem.s)) {
      subscriptionManager.notify(lastItem.s, lastItem);
    }
  });

  const subscribe = createSingletonSubscriptionHandler({
    subscriptionManager,
    sendFn: (symbol: string) => wsManager.send(JSON.stringify({ type: 'subscribe', symbol })),
    closeFn: (symbol: string) => wsManager.send(JSON.stringify({ type: 'unsubscribe', symbol }))
  });

  return {
    subscribe,
    unsubscribe: () => {
      unsubscribeSocket();
      subscriptionManager.allRemoveSubscriber();
    }
  };
};
