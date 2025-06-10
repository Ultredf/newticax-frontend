import api from '@/lib/api';

export interface SyncNewsParams {
  categories: string[];
  language: 'ENGLISH' | 'INDONESIAN';
  sources?: string[];
  limit?: number;
}

export interface SyncResult {
  totalSynced: number;
  errors: string[] | null;
  duplicates: number;
  newArticles: number;
}

export const syncNewsFromAPI = async (params: SyncNewsParams): Promise<SyncResult> => {
  const response = await api.post('/admin/sync-news', params);
  return response.data;
};

export const getSyncHistory = async (): Promise<Array<{
  id: string;
  syncedAt: string;
  totalSynced: number;
  language: string;
  categories: string[];
  status: 'success' | 'partial' | 'failed';
}>> => {
  const response = await api.get('/admin/sync-history');
  return response.data.data;
};

export const cancelSync = async (syncId: string): Promise<void> => {
  await api.post(`/admin/sync/${syncId}/cancel`);
};

export const retrySync = async (syncId: string): Promise<SyncResult> => {
  const response = await api.post(`/admin/sync/${syncId}/retry`);
  return response.data;
};