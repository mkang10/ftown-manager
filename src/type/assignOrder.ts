export interface AssignmentData {
    assignmentId: number;
    orderId: number;
    staffId: number;
    assignmentDate: string; // ISO format, nên dùng string
    comments: string;
  }
  
  export interface AssignStaffResponse {
    data: AssignmentData;
    status: boolean;
    message: string;
  }
  