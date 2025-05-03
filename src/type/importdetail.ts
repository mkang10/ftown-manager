import { ApiResponse } from "./apiResponse";

export interface StoreDetail {
    storeId: number;
    storeName: string;
    allocatedQuantity: number;
    status: string;
    comments: string;
    staffDetailId: number | null;
    staffName: string;
    actualQuantity: number;
  }
  
  export interface ImportDetailItem {
    importDetailId: number;
    productVariantId: number;
    quantity: number;
    productVariantName: string | null;
    storeDetails: StoreDetail[];
  }
  

  export interface InventoryImportItem {
    importId: number;
    referenceNumber: string;
    createdDate: string;
    approvedDate: string;
    completedDate: string;
    status: string;
    totalCost: number;
    createdByName: string;
    details: ImportDetailItem[];
    auditLogs: AuditLog[];
  }

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
  
  

 export type ImportDetailResponse = ApiResponse<InventoryImportItem>;
  
 