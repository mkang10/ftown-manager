import { AssignmentOrderFilters, AssignmentOrderListResponse, OrderResponse } from "@/type/order";
import { AssignStaffResponse } from "@/type/Staff";
import { CompleteOrderResponse } from "@/type/completeOrder";
import { AssignmentOrderResponse } from "@/type/orderdetail";
import { GetReturnRequestsParams, ReturnRequestsResponse } from "@/type/returnrequest";
import { AxiosResponse } from "axios";
import apiclient from "./apiclient";
import { UpdateStatusForm, UpdateStatusResponse } from "@/type/updatestatus";

export const getOrdersManager = async (
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<OrderResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.set("page", page.toString());
  queryParams.set("pageSize", pageSize.toString());

  // Lấy thông tin từ localStorage
  try {
    const accountString = localStorage.getItem("account");
    if (accountString) {
      const account = JSON.parse(accountString);

      const shopManagerId = account?.roleDetails?.shopManagerDetailId;

      if (shopManagerId) {
        queryParams.set("shopManagerId", shopManagerId.toString()); // 💡 bắt buộc truyền
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

  const url = `/orders?${queryParams.toString()}`;

  const response = await apiclient.get<{
    data: OrderResponse;
    status: boolean;
    message: string;
  }>(url);

  if (!response.data.status) {
    throw new Error(response.data.message || "Lỗi khi lấy danh sách đơn hàng");
  }

  return response.data.data;
};

export const assignOrderToStaff = async (
  orderId: number,
  staffId: number,
  comments: string = ""
): Promise<AssignStaffResponse> => {
  try {
    const payload = {
      orderId,
      staffId,
      comments,
    };

    const response = await apiclient.put<AssignStaffResponse>(
      `/orders/assign`, // API gốc: https://localhost:7265/api/orders/assign
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning staff:", error);
    throw error;
  }
};

export const completeOrder = async (
  orderId: number
): Promise<CompleteOrderResponse> => {
  try {
    const response = await apiclient.put<CompleteOrderResponse>(
      `/orders/${orderId}/complete`
    );
    return response.data;
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
};

export const getOrdersStaff = async (
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<OrderResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.set("page", page.toString());
  queryParams.set("pageSize", pageSize.toString());

  // Lấy thông tin từ localStorage và gán staffDetailId từ roleDetails vào staffId
  try {
    const accountString = localStorage.getItem("account");
    if (accountString) {
      const account = JSON.parse(accountString);
      const staffDetailId = account?.roleDetails?.staffDetailId;
      console.log("staffDetailId:", staffDetailId);
    
      if (staffDetailId) {
        queryParams.set("staffId", staffDetailId.toString());
      }
    }
  } catch (error) {
    console.warn("Failed to parse account from localStorage", error);
  }

  // Thêm các filter nếu có
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.set(key, value.toString());
      }
    });
  }

  const url = `/orders?${queryParams.toString()}`;
  const response = await apiclient.get<{
    data: OrderResponse;
    status: boolean;
    message: string;
  }>(url);

  if (!response.data.status) {
    throw new Error(response.data.message || "Lỗi khi lấy danh sách đơn hàng");
  }

  return response.data.data;
};
// src/api/apiclient.ts


// GET: Lấy thông tin Assignment + Order theo ID
export const getAssignmentOrderById = async (
  assignmentId: number
): Promise<AssignmentOrderResponse> => {
  try {
    const response = await apiclient.get<AssignmentOrderResponse>(
      `/orders/${assignmentId}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải thông tin đơn hàng:', error);
    throw error;
  }
};

export const getAssignmentStaffOrders = async (
  filters: AssignmentOrderFilters
): Promise<AssignmentOrderListResponse> => {
  try {
    const response = await apiclient.get<AssignmentOrderListResponse>(
      '/orders/assignment',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách đơn hàng:', error);
    throw error;
  }
};

export const getAssignmentManagerOrders = async (
  filters: AssignmentOrderFilters
): Promise<AssignmentOrderListResponse> => {
  try {
    const response = await apiclient.get<AssignmentOrderListResponse>(
      '/orders/assignment',
      { params: filters }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách đơn hàng:', error);
    throw error;
  }
};

export const getReturnRequests = async (
  params: GetReturnRequestsParams
): Promise<ReturnRequestsResponse> => {
  // Lấy thông tin account từ localStorage
  const storedAccount = localStorage.getItem("account");
  if (storedAccount) {
    try {
      const account = JSON.parse(storedAccount);
      const shopManagerDetail = account.roleDetails?.shopManagerDetailId;
      if (shopManagerDetail) {
        // Luôn đính kèm handledBy vào params
        params.handledBy = shopManagerDetail;
      }
    } catch (e) {
      // Nếu parse JSON lỗi thì bỏ qua
      console.warn("Không thể parse account từ localStorage", e);
    }
  }

  try {
    const response: AxiosResponse<ReturnRequestsResponse> = await apiclient.get(
      "/return-requests/all",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching return requests:", error);
    throw error;
  }
};


export const updateReturnRequestStatus = async (
  returnOrderId: number,
  form: {
    newStatus: string;
    comment?: string;
  }
): Promise<UpdateStatusResponse> => {
  try {
    // Lấy thông tin người dùng từ localStorage
    const storedAccount = localStorage.getItem('account');
    const account = storedAccount ? JSON.parse(storedAccount) : null;
    const shopManagerDetailId = account?.roleDetails?.shopManagerDetailId;

    if (!shopManagerDetailId) {
      throw new Error('Không thể xác định người thực hiện hành động (changedBy)');
    }

    // Khởi tạo FormData và append các trường
    const formData = new FormData();
    formData.append('newStatus', form.newStatus);
    formData.append('changedBy', shopManagerDetailId.toString());
    if (form.comment) {
      formData.append('comment', form.comment);
    }

    // Gọi API PUT /return-requests/{id}/status
    const response = await apiclient.put<UpdateStatusResponse>(
      `/return-requests/${returnOrderId}/status`,
      formData
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating return request status:', error);
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Unknown error');
    }
    throw error;
  }
};
