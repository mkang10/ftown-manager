import { ApiResponse } from "@/type/apiResponse";
import { AssignStaffResponse, GetStaffNamesResponse } from "@/type/Staff";
import apiclient from "./apiclient";

/**
 * Gán nhân viên cho import
 */
export const assignStaffDetail = async (
  importId: number,
  staffDetailId: number
): Promise<AssignStaffResponse> => {
  try {
    const response = await apiclient.put<AssignStaffResponse>(
      `/inventoryimport/${importId}/assign-staff?staffDetailId=${staffDetailId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning staff:", error);
    throw error;
  }
};

/**
 * Lấy danh sách tên của nhân viên từ API.
 */
export const getStaffNames = async (): Promise<GetStaffNamesResponse> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("localStorage is not available on server side.");
    }

    const accountStr = localStorage.getItem("account");
    let warehouseId: number | null = null;

    if (accountStr) {
      const account = JSON.parse(accountStr);
      warehouseId = account?.roleDetails?.storeId
        ? Number(account.roleDetails.storeId)
        : null;
    }

    if (!warehouseId) {
      throw new Error("Không xác định được warehouseId từ localStorage");
    }

    const response = await apiclient.get<GetStaffNamesResponse>(
      `/inventoryimport/names?warehouseId=${warehouseId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching staff names:", error);
    throw error;
  }
};

/**
 * Gán nhân viên cho dispatch
 */
export const assignDispatchStaffDetail = async (
  dispatchId: number,
  staffDetailId: number
): Promise<AssignStaffResponse> => {
  try {
    const response = await apiclient.put<AssignStaffResponse>(
      `/dispatch/${dispatchId}/assign-staff?staffDetailId=${staffDetailId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning staff:", error);
    throw error;
  }
};
