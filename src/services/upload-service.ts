import api from '@/lib/api';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export const uploadFile = async (file: File, folder?: string): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const uploadImages = async (files: File[]): Promise<UploadResponse[]> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });

  const response = await api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const deleteFile = async (url: string): Promise<void> => {
  await api.delete('/upload', { data: { url } });
};
