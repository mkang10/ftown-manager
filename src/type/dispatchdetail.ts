export interface DispatchResponseDto {
    jsonDispatchGet: JsonDispatchGet;
    auditLogs: AuditLog[];
  }
  
  /**
   * Thông tin chính của Dispatch
   */
  export interface JsonDispatchGet {
    dispatchId: number;
    createdByUser: string;
    createdDate: string; // ISO datetime
    status: string;
    referenceNumber: string;
    remarks: string | null;
    originalId: number | null;
    completedDate: string | null;
    details: DispatchDetail[];
  }
  
  /**
   * Chi tiết từng mục trong Dispatch
   */
  export interface DispatchDetail {
    dispatchDetailId: number;
    dispatchId: number;
    variantName: string;
    quantity: number;
    priceProductVariant: number;
    storeExportDetail: StoreExportDetail[];
  }
  
  /**
   * Thông tin kho xuất hàng trong DispatchDetail
   */
  export interface StoreExportDetail {
    warehouseName: string;
    allocatedQuantity: number;
    status: string;
    comments: string;
    staff: any | null;
    dispatchDetailId: number;
    handleBy: any | null;
    dispatchStoreDetailId: number;
    actualQuantity: number;
  }
  
  /**
   * Audit log cho Dispatch
   */
  export interface AuditLog {
    auditLogId: number;
    tableName: string;
    recordId: string;
    operation: string;
    changeDate: string; // ISO datetime
    changedBy: number;
    changeData: string;
    comment: string;
  }