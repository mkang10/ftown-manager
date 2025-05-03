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
  
  export interface ImportStoreDetail {
    actualReceivedQuantity: number;
    allocatedQuantity: number;
    status: string;
    comments: string;
    staff: string;
    importDetailId: number;
    importStoreId: number;
    warehouseName: string;
    handleBy: number | null;
    referenceNumber: string;
    productName : string;
    colorName : string;
    sizeName : string;
    costPrice: number | null;
    auditLogs: AuditLog[];
  }
  
  export interface ImportStoreDetailResponse {
    data: ImportStoreDetail;
    status: boolean;
    message: string;
  }