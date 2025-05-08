import axios, { AxiosInstance } from 'axios';

// Use an env var or hard‐code your baseURL
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://ftadminservice.azurewebsites.net/api/';

const adminClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
    Accept: '*/*',
  },
});

// const baseURL =
//   process.env.NEXT_PUBLIC_API_URL ??
//   'https://localhost:7267/api/';

// const adminClient: AxiosInstance = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
//     Accept: '*/*',
//   },
// });


// Only run this interceptor in the browser
if (typeof window !== 'undefined') {
  adminClient.interceptors.request.use(
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

export default adminClient;
