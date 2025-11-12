declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}

export const IS_TAURI = window.__TAURI__ !== undefined;
export const IS_DEV = import.meta.env.DEV;

export const getApiUrl = (path: string) => {
  if (IS_TAURI) {
    return `http://192.168.1.100:8082${path}`;
  }
  return `${path}`;
};

export const getImageUrl = (filename: string) => {
  if (!filename) return '/exoplanet-temp-frontend/DefaultImage.jpg';

  if (IS_TAURI) {
    return `http://192.168.1.100:9000/minio-backend/${filename}`;
  }
  return `/minio/minio-backend/${filename}`;
};