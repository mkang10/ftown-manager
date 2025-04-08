import { ApiResponse } from "./apiResponse";

// types.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RoleDetails {
    staffDetailId: number;
    storeId: number;
    joinDate: string; // ISO date string
    role: string;
    jobTitle: string;
    department: string;
    salary: number | null;
    employmentType: string | null;
  }
  
  export interface Account {
    accountId: number;
    fullName: string;
    email: string;
    createdDate: string | null;
    lastLoginDate: string | null;
    isActive: boolean;
    roleId: number;
    imagePath: string | null;
    roleDetails: RoleDetails;
  }

  export interface LoginResponseData {
    token: string;
    account: Account;
  }

export type LoginResponse = ApiResponse<LoginResponseData>;
  