export interface UpdateStatusForm {
    newStatus: string;
    changedBy: number;
    comment?: string;
  }
  
  export interface UpdateStatusResponse {
    status: boolean;
    message: string;
    // nếu có thêm data trả về bạn khai báo ở đây
  }