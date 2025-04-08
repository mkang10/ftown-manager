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
      const response = await shopmanagerclient.get<GetStaffNamesResponse>(
        "/inventoryimport/names"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching staff names:", error);
      throw error;
    }
  };