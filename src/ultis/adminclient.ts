import axios, { AxiosInstance } from 'axios';

const adminclient: AxiosInstance = axios.create({
  baseURL: 'https://localhost:7267/api/',
  headers: {
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    Accept: '*/*',
  },
});

if (typeof window !== 'undefined') {
  adminclient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
}

export default adminclient;
