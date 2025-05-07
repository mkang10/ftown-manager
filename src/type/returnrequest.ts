// Thông tin đơn trả hàng chính
export interface ReturnOrder {
  returnOrderId: number;
  orderId: number;
  accountName: string;
  totalRefundAmount: number;
  returnOption: string;
  returnDescription: string;
  email: string;
  status: string;
  createdDate: string;  // ISO string
}

// Chi tiết thêm về đơn trả hàng
export interface ReturnOrderDetail {
  updatedDate: string | null;           // ISO string hoặc null
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  refundMethod: string;
  returnImages: string[];               // mảng URL ảnh
}

// Các mặt hàng trong đơn trả hàng
export interface ReturnOrderItem {
  productVariantName: string;
  size: string;
  color: string;
  imageUrl: string;
  quantity: number;
  priceAtPurchase: number;
  shippingCost: number;
  price: number;
}

// 1 mục trong mảng items của response
export interface ReturnRequestItem {
  returnOrder: ReturnOrder;
  returnOrderDetail: ReturnOrderDetail;
  returnOrderItems: ReturnOrderItem[];
}

// Params để gọi API lấy danh sách
export interface GetReturnRequestsParams {
  status?: string;
  returnOption?: string;
  dateFrom?: string;       // ISO date-time string, ví dụ "2025-04-01T00:00:00Z"
  dateTo?: string;         // ISO date-time string
  orderId?: number;        // lọc theo mã đơn
  returnOrderId?: number;  // lọc theo mã yêu cầu trả hàng
  handledBy?: number;      // lọc theo ID user đã xử lý
  pageNumber?: number;
  pageSize?: number;
}


// Kết quả trả về từ API
export interface ReturnRequestsResponse {
  data: {
    items: ReturnRequestItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  status: boolean;
  message: string;
}
