import { Subscriber, SubscriptionManager } from './subscription-manager';

export interface SocketHandler<T> {
  handleMessage: (data: unknown) => T | null;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export const createWs = (url: string) => {
  const ws = new WebSocket(url);
  let isConnected = false;
  const SUBSCRIPTION_KEY = 'ws';
  const subscriptionManager = new SubscriptionManager<ConnectionStatus>();

  ws.addEventListener('open', () => {
    isConnected = true;
    subscriptionManager.notify(SUBSCRIPTION_KEY, 'connected');
  });

  ws.addEventListener('close', () => {
    isConnected = false;
    subscriptionManager.notify(SUBSCRIPTION_KEY, 'disconnected');
  });

  ws.addEventListener('error', () => {
    isConnected = false;
    subscriptionManager.notify(SUBSCRIPTION_KEY, 'error');
  });

  return {
    send: (message: string) => {
      if (isConnected) {
        try {
          ws.send(message);
        } catch (err) {
          console.error('Failed to send message:', err);
        }
      }
    },
    subscribe: <T>(handler: SocketHandler<T>, callback: Subscriber<T>) => {
      const wsCallback = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data.toString());
          const parsedData = handler.handleMessage(data);
          if (parsedData) callback(parsedData);
        } catch (err) {
          console.error('Failed to parse message:', err);
        }
      };
      ws.addEventListener('message', wsCallback);

      return () => {
        ws.removeEventListener('message', wsCallback);
        ws.close();
      };
    },
    subscribeToStatus: (callback: (status: ConnectionStatus) => void) => {
      subscriptionManager.addSubscriber(SUBSCRIPTION_KEY, callback);
      callback(isConnected ? 'connected' : 'connecting');

      return () => subscriptionManager.removeSubscriber(SUBSCRIPTION_KEY, callback);
    },
    isConnected: () => isConnected
  };
};
