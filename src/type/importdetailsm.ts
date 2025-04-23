export interface ImportResponseDto {
    importId: number;
    referenceNumber: string;
    createdDate: string; // ISO
    status: string;
    totalCost: number;
    createdByName: string;
    approvedDate: string | null;
    completedDate: string | null;
    details: ImportDetail[];
    auditLogs: AuditLog[];
  }
  
  export interface ImportDetail {
    importDetailId: number;
    productVariantId: number;
    productVariantName: string;
    quantity: number;
    storeDetails: StoreDetail[];
  }
  
  export interface StoreDetail {
    storeId: number;
    storeName: string;
    allocatedQuantity: number;
    actualQuantity: number | null;
    status: string;
    comments: string | null;
    staffDetailId: number;
    staffName: string;
  }
  
  export interface AuditLog {
    auditLogId: number;
    tableName: string;
    recordId: string;
    operation: string;
    changeDate: string;
    changedBy: number;
    changeData: string;
    comment: string;
  }
  