import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { NewsDataSchema, TradeDataSchema } from './schema';
import { ConnectionStatus, createWs } from '@stock-day/utils/ws-observer';
import { createFinnHubNews, createFinnHubTrade } from './services';

const wsManager = createWs('wss://localhost');
const newsManager = createFinnHubNews();
const tradeManager = createFinnHubTrade();

export const useFinnHubNews = (initialSymbol: string) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [news, setNews] = useState<z.infer<typeof NewsDataSchema>>();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  let unsubscribe: () => void;
  let unsubscribeStatus: () => void;

  const changeSymbol = useCallback((newSymbol: string) => {
    setSymbol(newSymbol);
  }, []);

  useEffect(() => {
    unsubscribeStatus = wsManager.subscribeToStatus(setConnectionStatus);

    if (!!unsubscribe) unsubscribe();

    if (connectionStatus === 'connected') {
      unsubscribe = newsManager.subscribe(symbol, (data: z.infer<typeof NewsDataSchema>) => setNews(data));
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (unsubscribeStatus) unsubscribeStatus();
    };
  }, [symbol, connectionStatus]);

  return { news, changeSymbol, connectionStatus };
};

export const useFinnHubTrade = (initialSymbol: string) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [trade, setTrade] = useState<z.infer<typeof TradeDataSchema>>();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  let unsubscribe: () => void;
  let unsubscribeStatus: () => void;

  const changeSymbol = useCallback((newSymbol: string) => {
    setSymbol(newSymbol);
  }, []);

  useEffect(() => {
    unsubscribeStatus = wsManager.subscribeToStatus(setConnectionStatus);

    if (!!unsubscribe) unsubscribe();

    if (connectionStatus === 'connected') {
      unsubscribe = tradeManager.subscribe(symbol, (data: z.infer<typeof TradeDataSchema>) => setTrade(data));
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (unsubscribeStatus) unsubscribeStatus();
    };
  }, [symbol, connectionStatus]);

  return { trade, changeSymbol, connectionStatus };
};
