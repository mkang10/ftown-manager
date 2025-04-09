import { DispatchResponse } from "@/type/dispatch";
import shopmanagerclient from "./ShopmanagerClient";
import { DispatchStoreDetailResponse } from "@/type/dispatchStoreDetail";
import { FullStockDetail, FullStockResponse } from "@/type/importStaff";
export const getDispatches = async (
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<DispatchResponse> => {
  const queryParams = new URLSearchParams();

  // Ghi đè để không bị nhân đôi
  queryParams.set("page", page.toString());
  queryParams.set("pageSize", pageSize.toString());
  queryParams.set("Status", "Approved"); // ép trạng thái duyệt

  // Lấy warehouseId từ account trong localStorage
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

  // Gán thêm các filters nếu có
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.set(key, value.toString());
      }
    });
  }

  const response = await shopmanagerclient.get<{
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

  // Lấy staffDetailId từ localStorage
  const storedAccount = localStorage.getItem("account");
  let staffId = 0;
  if (storedAccount) {
    const account = JSON.parse(storedAccount);
    staffId = account.roleDetails?.staffDetailId || 0;
  }

  // ⚠️ Luôn truyền staffId vào filters
  queryParams.append("staffDetailId", staffId.toString());

  // Thêm các tham số bắt buộc (sử dụng chữ thường)
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());

  // Thêm các filter tùy chọn
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }

  // Nếu API cũng cần các trường Page, PageSize (chữ hoa) thì thêm
  if (!queryParams.has("Page")) {
    queryParams.append("Page", page.toString());
  }
  if (!queryParams.has("PageSize")) {
    queryParams.append("PageSize", pageSize.toString());
  }

  const response = await shopmanagerclient.get<{
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
  dispatchid : number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  const url = `/dispatch/${dispatchid }/done?staffId=${staffId}`;
  const response = await shopmanagerclient.post<FullStockResponse>(
    url,
    details,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};