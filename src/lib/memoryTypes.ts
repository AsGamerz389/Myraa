export interface MemoryItem {
  id: string;
  category: 'preference' | 'conversation' | 'fact' | 'system';
  content: string;
  createdAt: number;
  importance: number;
}

export interface MemoryStats {
  totalItems: number;
  storageUsedKb: number;
  lastSyncedAt?: number;
}
