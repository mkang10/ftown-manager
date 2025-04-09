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
  
 