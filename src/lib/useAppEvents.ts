import { useEffect } from 'react';
import { appEvents, AppEventCallback } from 'shared/appEvents';

export function useAppEvent<T = any>(event: string, callback: AppEventCallback<T>): void {
  useEffect(() => {
    return appEvents.on<T>(event, callback);
  }, [event, callback]);
}
