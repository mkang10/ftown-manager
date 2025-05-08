import axios, { AxiosInstance } from 'axios';

// Khởi tạo axios với URL gốc của API
// const authclient: AxiosInstance = axios.create({
//   baseURL: 'https://localhost:7261/api/',
//   headers: {
//     'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
//     Accept: '*/*',
//   },
// });

const authclient: AxiosInstance = axios.create({
  baseURL: 'https://ftauthservice.azurewebsites.net/api/',
  headers: {
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    Accept: '*/*',
  },
});

// Thêm interceptor để tự động thêm token vào tiêu đề (chỉ trên client)
if (typeof window !== 'undefined') {
  authclient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào tiêu đề
      }
      return config; // Trả về cấu hình đã chỉnh sửa
    },
    error => {
      return Promise.reject(error);
    }
  );
}

export default authclient;
