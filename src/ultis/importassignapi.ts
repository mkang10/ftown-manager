import { FilterStaffInventoryResponse } from "@/type/importassign";
import apiclient from "./apiclient";

export const filterStaffInventoryImports = async (
    filterData: {
      Page?: number;
      PageSize?: number;
      Status?: string;
      SortBy?: string;
      IsDescending?: boolean;
      Handleby?: number; // ✅ thêm dòng này để tránh lỗi

    }
  ): Promise<FilterStaffInventoryResponse> => {
    try {
      // Lấy StaffDetailId từ localStorage (nếu có)
      const storedAccount = localStorage.getItem("account");
      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        const shopManagerDetail = account.roleDetails?.shopManagerDetailId;
        if (shopManagerDetail) {
          filterData.Handleby = shopManagerDetail; // luôn truyền StaffDetailId vào filter
        }
      }
  
      // Tạo query string từ filterData
      const params = new URLSearchParams();
      Object.entries(filterData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
  
      // Gọi API
      const response = await apiclient.get<FilterStaffInventoryResponse>(
        `/inventoryimport/assign-staff?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error filtering staff inventory imports:", error);
      throw error;
    }
  };