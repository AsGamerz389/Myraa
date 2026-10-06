/**
 * Application Events Event Bus
 */

export type AppEventCallback<T = any> = (payload: T) => void;

class EventBus {
  private listeners: Map<string, Set<AppEventCallback>> = new Map();

  on<T>(event: string, callback: AppEventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off<T>(event: string, callback: AppEventCallback<T>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit<T>(event: string, payload?: T): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in event handler for ${event}:`, err);
        }
      }
    }
  }
}

export const appEvents = new EventBus();
