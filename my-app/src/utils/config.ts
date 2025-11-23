declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}

export const IS_TAURI = window.__TAURI__ !== undefined;
export const IS_DEV = import.meta.env.DEV;

const BACKEND_IP = "172.17.114.35";

export const getApiUrl = (path: string) => {
  if (IS_TAURI && !IS_DEV) {
    return `http://${BACKEND_IP}:8082${path}`;
  }
  return `${path}`;
};

export const getImageUrl = (filename: string) => {
  if (!filename) return '/DefaultImage.jpg';

  if (IS_TAURI) {
    return `http://${BACKEND_IP}:9001/minio-backend/${filename}`;
  }
  return `/minio/minio-backend/${filename}`;
};