import { Api } from './Api';
import { store } from '../store';

const apiInstance = new Api();

apiInstance.instance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiInstance.instance.defaults.baseURL = '';

export const api = apiInstance;