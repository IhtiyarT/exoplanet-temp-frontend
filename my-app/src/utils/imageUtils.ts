// src/utils/imageUtils.ts
export const getImageUrl = (filename: string | null | undefined): string => {
  if (!filename || filename === '/DefaultImage.jpg' || filename === 'DefaultImage.jpg') {
    return '/DefaultImage.jpg';
  }

  if (import.meta.env.DEV) {
    return `/minio/minio-backend/${filename}`;
  } else {
    return `/planets/${filename}`;
  }
};