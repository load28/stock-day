export type Subscriber<T> = (value: T) => void;

export class SubscriptionManager<T> {
  private subscribers: Map<string, Set<Subscriber<T>>> = new Map();

  addSubscriber(key: string, callback: Subscriber<T>): () => boolean {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);
    return () => this.removeSubscriber(key, callback);
  }

  removeSubscriber(key: string, callback: Subscriber<T>): boolean {
    const symbolSubscribers = this.subscribers.get(key);
    if (!symbolSubscribers) return false;

    symbolSubscribers.delete(callback);
    if (symbolSubscribers.size === 0) {
      this.subscribers.delete(key);
      return true;
    }
    return false;
  }

  allRemoveSubscriber(): void {
    this.subscribers.clear();
  }

  notify(key: string, data: T) {
    const symbolSubscribers = this.subscribers.get(key);
    symbolSubscribers?.forEach((callback) => callback(data));
  }

  hasSubscribers(key: string): boolean {
    return this.subscribers.has(key) && this.subscribers.get(key)!.size > 0;
  }

  getSubscriberCount(key: string): number {
    return this.subscribers.has(key) ? this.subscribers.get(key)!.size : 0;
  }
}

export const createSingletonSubscriptionHandler = <T>(params: {
  sendFn: (key: string) => void;
  closeFn: (key: string) => void;
  subscriptionManager: SubscriptionManager<T>;
}) => {
  const { sendFn, closeFn, subscriptionManager } = params;
  return (key: string, callback: Subscriber<T>) => {
    const unsubscribe = subscriptionManager.addSubscriber(key, callback);
    if (subscriptionManager.getSubscriberCount(key) === 1) {
      sendFn(key);
    }
    return () => {
      const wasLast = unsubscribe();
      if (wasLast) {
        closeFn(key);
      }
    };
  };
};
