import { Api } from './Api';
import { store } from '../store';

const apiInstance = new Api();

apiInstance.instance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  console.log("[API Interceptor] Token:", token ? "present" : "missing", "URL:", config.url);
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[API Interceptor] Authorization header set");
  } else {
    console.warn("[API Interceptor] No token found in store");
  }
  return config;
});

apiInstance.instance.defaults.baseURL = '';

export const api = apiInstance;