import apiclient from "./apiclient";
import { LoginRequest, LoginResponse, } from "@/type/auth"; // Cập nhật đường dẫn nếu cần
import axios from 'axios';
import authclient from "./authclient";


// POST: Đăng nhập người dùng
const token = localStorage.getItem('token');


export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        // const response = await apiclient.post<LoginResponse>(
        //     '/auth/login',
        //     credentials
        // );
        const response = await authclient.post<LoginResponse>(
          '/auth/login',
          credentials
      );
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

