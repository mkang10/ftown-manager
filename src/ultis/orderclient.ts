import axios, { AxiosInstance } from 'axios';

// Bạn có thể thay baseURL tùy vào môi trường:
// const orderclient: AxiosInstance = axios.create({
//   baseURL: 'https://localhost:7266/api/', // hoặc dùng biến môi trường
//   headers: {
//     'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
//     Accept: '*/*',
//   },
// });

const orderclient: AxiosInstance = axios.create({
  baseURL: 'https://ftorderserviceapi.azurewebsites.net/api/', // hoặc dùng biến môi trường
  headers: {
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    Accept: '*/*',
  },
});

// Chỉ gắn interceptor khi chạy ở phía client (tránh lỗi SSR)
if (typeof window !== 'undefined') {
    orderclient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export default orderclient;
