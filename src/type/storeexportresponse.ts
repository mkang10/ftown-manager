export interface AuditLog {
    auditLogId: number;
    tableName: string;
    recordId: string;
    operation: string;
    changeDate: string;
    changedByName: string;
    changeData: string;
    comment: string;
  }
  
  export interface DispatchStoreDetail {
    warehouseName: string;
    allocatedQuantity: number;
    status: string;
    comments: string;
    staff: string | null;
    dispatchDetailId: number;
    handleBy: string;
    dispatchStoreDetailId: number;
    actualQuantity: number | null;
    referenceNumber: string;
    auditLogs: AuditLog[];
    colorName : string;
    sizeName : string;
    productName : string;
  }
  
  export interface DispatchStoreDetailResponse {
    data: DispatchStoreDetail;  // đảm bảo đây là object, không phải mảng
    status: boolean;
    message: string;
  }
  