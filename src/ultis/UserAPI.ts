
import { User, UserProfileUpdateDTO } from "@/type/user";
import apiclient from "./apiclient";
import { AxiosError } from "axios";



export const getUserById = async (userId: number): Promise<User> => {
    try {
        const response = await apiclient.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by id:', error);
        throw new Error('Error fetching user by id');
    }
};

// Update user profile API
export const updateUserProfileApi = async (userId: number, formData: UserProfileUpdateDTO) => {
    try {
        const formDataToSend = new FormData();

        formDataToSend.append('Email', formData.email);
        formDataToSend.append('FullName', formData.fullName);
        formDataToSend.append('PhoneNumber', formData.phoneNumber);
        formDataToSend.append('Address', formData.address);
        formDataToSend.append('Gender', formData.gender);
        formDataToSend.append('DateOfBirth', formData.dateOfBirth);

        if (formData.profileImage) {
            formDataToSend.append('ProfileImage', formData.profileImage);
        }

        const response = await apiclient.put(`/user/profile/${userId}`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error updating user profile:', axiosError.response?.data || axiosError.message);
        throw axiosError;
    }
};