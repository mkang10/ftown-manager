import { ApiResponse } from "@/type/apiResponse";
import { AssignStaffResponse, GetStaffNamesResponse } from "@/type/Staff";
import shopmanagerclient from "./ShopmanagerClient";
export const assignStaffDetail = async (
    importId: number,
    staffDetailId: number
  ): Promise<AssignStaffResponse> => {
    try {
      const response = await shopmanagerclient.put<AssignStaffResponse>(
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
      const accountStr = localStorage.getItem("account");
      let warehouseId: number | null = null;
      if (accountStr) {
        const account = JSON.parse(accountStr);
        warehouseId = account?.roleDetails?.storeId ? Number(account.roleDetails.storeId) : null;
      }
  
      if (!warehouseId) {
        throw new Error("Không xác định được warehouseId từ localStorage");
      }
  
      // Gửi dưới dạng query param (GET)
      const response = await shopmanagerclient.get<GetStaffNamesResponse>(
        `/inventoryimport/names?warehouseId=${warehouseId}`
      );
  
      return response.data;
    } catch (error) {
      console.error("Error fetching staff names:", error);
      throw error;
    }
  };

  export const assignDispatchStaffDetail = async (
    dispatchId: number,
    staffDetailId: number
  ): Promise<AssignStaffResponse> => {
    try {
      const response = await shopmanagerclient.put<AssignStaffResponse>(
        `/dispatch/${dispatchId}/assign-staff?staffDetailId=${staffDetailId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning staff:", error);
      throw error;
    }
  };