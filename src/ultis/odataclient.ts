import axios, { AxiosInstance } from 'axios';

// Khởi tạo axios với URL gốc của API
const odataClient: AxiosInstance = axios.create({
  baseURL: 'https://localhost:7050/odata',
  headers: {
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    Accept: '*/*',
  },
});

// Thêm interceptor để tự động thêm token vào tiêu đề
odataClient.interceptors.request.use(
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

export default odataClient;