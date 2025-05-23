import axios, { AxiosInstance } from 'axios';

// Khởi tạo axios với URL gốc của API

// Deploy
// const apiclient: AxiosInstance = axios.create({
//   baseURL: 'https://apivietnong-f9a8ecdydsdmebb3.canadacentral-01.azurewebsites.net/api',
//   headers: {
//     'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
//     Accept: '*/*',
//   },
// });

// Localhost
const apiclient: AxiosInstance = axios.create({
  baseURL: 'https://localhost:7261/api/',
  headers: {
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    Accept: '*/*',
  },
});

// ⚠️ Chỉ thêm interceptor khi đang chạy ở client-side
if (typeof window !== 'undefined') {
  apiclient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào tiêu đề
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
}

export default apiclient;
