export interface CompleteOrderData {
    orderId: number;
    status: string;
  }
  
  export interface CompleteOrderResponse {
    data: CompleteOrderData;
    status: boolean;
    message: string;
  }
  