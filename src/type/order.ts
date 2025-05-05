export interface OrderAssignment {
    assignmentId: number;
    orderId: number;
    shopManagerId: number;
    staffId: number;
    assignmentDate: string; // ISO date string
    comments?: string | null;
  }
  
  export interface Order {
    orderId: number;
    accountId: number;
    buyerName : string;
    createdDate: string;
    status: string;
    orderTotal: number;
    orderAssignments: OrderAssignment[];
  }
  
  export interface OrderResponse {
    data: Order[];
    totalRecords: number;
    page: number;
    pageSize: number;
  }
  
  // Kiểu dữ liệu cho filter đơn hàng
  export interface OrderFilterData {
    orderStatus: string;
    orderStartDate: string;
    orderEndDate: string;
    shopManagerId: string; // dùng string để binding từ input, chuyển sang number khi gọi API
    assignmentStartDate: string;
    staffId: string;
    assignmentEndDate: string;
  }
  
  export interface OrderDetail {
    orderDetailId: number;
    productVariantId: number;
    productName: string;
    variantName: string | null;
    quantity: number;
    priceAtPurchase: number;
    discountApplied: number;
    sizeName: string;
    colorName: string;
    imageUrl: string 
  }
  
  export interface OrderInfo {
    orderId: number;
    createdDate: string;
    status: string;
    orderTotal: number;
    shippingCost: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    district: string;
    country: string;
    province: string;
    orderDetails: OrderDetail[];
  }
  
  export interface AssignmentOrderResponse {
    assignmentId: number;
    shopManagerId: number;
    staffId: number | null;
    assignmentDate: string;
    comments: string | null;
    order: OrderInfo;
  }
  
  // Filter params for list endpoint
  export interface AssignmentOrderFilters {
    assignmentId?: number;
    shopManagerId?: number;
    staffId?: number;
    assignmentDateFrom?: string;
    assignmentDateTo?: string;
    commentsContains?: string;
    orderCreatedDateFrom?: string;
    orderCreatedDateTo?: string;
    orderStatus?: string;
    minOrderTotal?: number;
    maxOrderTotal?: number;
    fullNameContains?: string;
    page?: number;
    pageSize?: number;
  }
  
  export interface AssignmentOrderListResponse {
    data: AssignmentOrderResponse[];
    totalRecords: number;
    page: number;
    pageSize: number;
  }
  
  
 