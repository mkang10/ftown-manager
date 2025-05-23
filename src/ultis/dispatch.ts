import { DispatchResponse } from "@/type/dispatch";
import apiclient from "./apiclient";
import { DispatchStoreDetailResponse } from "@/type/dispatchStoreDetail";
import { FullStockDetail, FullStockResponse } from "@/type/importStaff";
import { DispatchResponseDto } from "@/type/dispatchdetail";

export const getDispatches = async (
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<DispatchResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.set("page", page.toString());
  queryParams.set("pageSize", pageSize.toString());
  queryParams.set("Status", "Approved");

  // Chỉ dùng localStorage nếu ở client
  if (typeof window !== 'undefined') {
    try {
      const accountString = localStorage.getItem("account");
      if (accountString) {
        const account = JSON.parse(accountString);
        const storeId = account?.roleDetails?.storeId;
        if (storeId) {
          queryParams.set("WarehouseId", storeId.toString());
        }
      }
    } catch (error) {
      console.warn("Failed to parse account from localStorage", error);
    }
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.set(key, value.toString());
      }
    });
  }

  const response = await apiclient.get<{
    data: DispatchResponse;
    status: boolean;
    message: string;
  }>(`/dispatch/get-all?${queryParams.toString()}`);

  if (!response.data.status) {
    throw new Error(response.data.message || "Lỗi khi lấy danh sách dispatch");
  }

  return response.data.data;
};


export const getAllDispatches = async (
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<DispatchResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.set("page", page.toString());
  queryParams.set("pageSize", pageSize.toString());

  // Chỉ dùng localStorage nếu ở client
  if (typeof window !== 'undefined') {
    try {
      const accountString = localStorage.getItem("account");
      if (accountString) {
        const account = JSON.parse(accountString);
        const storeId = account?.roleDetails?.storeId;
        if (storeId) {
          queryParams.set("WarehouseId", storeId.toString());
        }
      }
    } catch (error) {
      console.warn("Failed to parse account from localStorage", error);
    }
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.set(key, value.toString());
      }
    });
  }

  const response = await apiclient.get<{
    data: DispatchResponse;
    status: boolean;
    message: string;
  }>(`/dispatch/get-all?${queryParams.toString()}`);

  if (!response.data.status) {
    throw new Error(response.data.message || "Lỗi khi lấy danh sách dispatch");
  }

  return response.data.data;
};

export const filterDispatchStoreDetails = async (
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<DispatchStoreDetailResponse> => {
  const queryParams = new URLSearchParams();

  let staffId = 0;

  // Chỉ đọc localStorage nếu là client
  if (typeof window !== 'undefined') {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      staffId = account.roleDetails?.staffDetailId || 0;
    }
  }

  queryParams.append("staffDetailId", staffId.toString());
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }

  // Optional: fallback nếu backend yêu cầu Page/PageSize viết hoa
  if (!queryParams.has("Page")) {
    queryParams.append("Page", page.toString());
  }
  if (!queryParams.has("PageSize")) {
    queryParams.append("PageSize", pageSize.toString());
  }

  const response = await apiclient.get<{
    data: DispatchStoreDetailResponse;
    status: boolean;
    message: string;
  }>(`/dispatch/by-staff?${queryParams.toString()}`);

  if (!response.data.status) {
    throw new Error(response.data.message || "Lỗi khi lấy dữ liệu dispatch store details");
  }

  return response.data.data;
};

export const updateFullStockDispatch = async (
  dispatchid: number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  const url = `/dispatch/${dispatchid}/done?staffId=${staffId}`;
  const response = await apiclient.post<FullStockResponse>(
    url,
    details,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};
export const getDispatchById = async (
  id: number
): Promise<DispatchResponseDto> => {
  const response = await apiclient.get<{ data: DispatchResponseDto }>(
    `/dispatch/dispatch/${id}`
  );
  return response.data.data;
};