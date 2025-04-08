// /src/api/inventoryImportApi.ts
import shopmanagerclient from "./ShopmanagerClient";
import {
  FilterInventoryResponse,
} from "@/type/InventoryImport";

// GET: Lấy danh sách Inventory Import
// /src/ultis/importapi.ts
import apiclient from "./apiclient";
import adminclient from "./adminclient";
import { productVariant } from "@/type/Product";
import { ImportDetailResponse } from "@/type/importdetail";
import { InventoryImportCreateRequest, InventoryImportCreateResponse } from "@/type/createInventoryImport";
import { FilterStaffInventoryResponse } from "@/type/importStaff";
import { FullStockResponse, FullStockDetail } from "@/type/importStaff";




// POST: Tạo mới Inventory Import
export const createInventoryImport = async (
  data: InventoryImportCreateRequest
): Promise<InventoryImportCreateResponse> => {
  try {
    const response = await shopmanagerclient.post<InventoryImportCreateResponse>(
      "/inventoryimport/create",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating inventory import:", error);
    throw error;
  }
};

// Hàm filter inventory imports theo các trường filter (truyền vào dưới dạng FormData)
export const filterInventoryImports = async (
  filterData: Record<string, any>
): Promise<FilterInventoryResponse> => {
  try {
    // Tạo query string từ filterData
    const queryParams = new URLSearchParams();
    Object.keys(filterData).forEach((key) => {
      if (filterData[key]) {
        queryParams.append(key, filterData[key]);
      }
    });

    // Gọi GET với query string
    const response = await shopmanagerclient.get<FilterInventoryResponse>(
      `/inventoryimport/get-all?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering inventory imports:", error);
    throw error;
  }
};

export const getProductVariants = async (
  page: number = 1,
  pageSize: number = 5
): Promise<{ data: productVariant[]; totalRecords: number }> => {
  try {
    const response = await apiclient.get<{
      data: {
        data: productVariant[];
        totalRecords: number;
        page: number;
        pageSize: number;
      };
      status: boolean;
      message: string;
    }>(`/inventoryimport/product?page=${page}&pageSize=${pageSize}`);
    if (response.data.status) {
      return {
        data: response.data.data.data,
        totalRecords: response.data.data.totalRecords,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error;
  }
};

export const getImportDetail = async (importId: number): Promise<ImportDetailResponse> => {
  try {
    // Gửi GET request với importId được đính kèm trong URL
    const response = await adminclient.get<ImportDetailResponse>(`/inventoryimport/${importId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching import detail:", error);
    throw error;
  }
};

export const filterStaffInventoryImports = async (
  filterData: Record<string, any>
): Promise<FilterStaffInventoryResponse> => {
  try {
    // Tạo query string từ filterData
    const queryParams = new URLSearchParams();
    Object.keys(filterData).forEach((key) => {
      // Kiểm tra nếu giá trị không undefined, null hoặc chuỗi rỗng
      if (filterData[key] !== undefined && filterData[key] !== null && filterData[key] !== "") {
        queryParams.append(key, String(filterData[key]));
      }
    });

    // Gọi GET với query string, ví dụ sử dụng axios instance shopmanagerclient
    const response = await shopmanagerclient.get<FilterStaffInventoryResponse>(
      `/inventoryimport/by-staff/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering staff inventory imports:", error);
    throw error;
  }
};

// ultis/importRequest.ts

export const updateFullStock = async (
  importId: number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  const url = `/inventoryimport/${importId}/done?staffId=${staffId}`;
  const response = await shopmanagerclient.post<FullStockResponse>(
    url,
    details,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const updateCancelled = async (
  importId: number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  // Endpoint cập nhật cancelled, thay updateLowStock
  const url = `/inventoryimport/${importId}/incompleted?staffId=${staffId}`;
  const response = await shopmanagerclient.post<FullStockResponse>(
    url,
    details,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const updateShortage = async (
  importId: number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  const url = `/inventoryimport/shortage?importId=${importId}&staffId=${staffId}`;
  const response = await shopmanagerclient.post<FullStockResponse>(
    url,
    details,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};