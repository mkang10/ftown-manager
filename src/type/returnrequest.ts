
// Model chi tiết sản phẩm trả lại
export interface ReturnItem {
  productVariantId: number;
  productName: string;
  color: string;
  size: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

// Model đơn hàng gốc
export interface OriginalOrderItem {
  orderDetailId: number;
  productVariantId: number;
  productId: number;
  productName: string;
  quantity: number;
  imageUrl: string;
  size: string;
  color: string;
  price: number;
  priceAtPurchase: number;
  discountApplied: number;
}

export interface OriginalOrder {
  orderId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  district: string;
  province: string;
  country: string;
  paymentMethod: string;
  orderTotal: number;
  shippingCost: number;
  status: string;
  createdDate: string;
  ghnid: string;
  orderItems: OriginalOrderItem[];
}

// Model yêu cầu đổi trả
export interface ReturnRequestItem {
  returnOrderId: number;
  orderId: number;
  status: string;
  createdDate: string;
  totalRefundAmount: number;
  refundMethod: string;
  returnReason: string;
  returnOption: string;
  returnDescription: string;
  returnImages: string[];
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  returnItems: ReturnItem[];
  order: OriginalOrder;
}

// Params cho API
export interface GetReturnRequestsParams {
  status?: string;
  returnOption?: string;
  dateFrom?: string;
  dateTo?: string;
  orderId?: number;
  pageNumber?: number;
  pageSize?: number;
}

// Response API
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