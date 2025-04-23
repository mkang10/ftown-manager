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
    staffId: number;
    assignmentDate: string;
    comments: string;
    order: OrderInfo;
  }
  