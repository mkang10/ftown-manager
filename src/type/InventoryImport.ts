// /src/types/inventoryImport.ts

import { ApiResponse } from "./apiResponse";
import { PageResult } from "./pageResult";

// Dữ liệu cho request lọc Inventory Import (dựa trên ImportFilterDto)
export interface InventoryImportFilterRequest {
  Status?: string;
  ReferenceNumber?: string;
  HandleBy?: number;
  FromDate?: string;       // ISO date string
  ToDate?: string;         // ISO date string
  SortBy?: string;         // Mặc định "ImportId"
  IsDescending?: boolean;  // Mặc định false
  Page?: number;           // Mặc định 1
  PageSize?: number;       // Mặc định 10
}

  export interface InventoryImportDetail {
    importDetailId: number;
    importId: number;
    productVariantId: number;
    quantity: number;
    importStoreDetails: ImportStoreDetail[]; 

  }
  
  export interface ImportStoreDetail {
    wareHouseId: number;
    allocatedQuantity: number;
    status: string;
    comments: string | null;
    staffDetailId: number | null;
    storeImportStoreId: number;
    handleBy: number;
    handleByName: string | null;
  }
  

  export interface InventoryImportItem {
    importId: number;
    email :string;
    createdBy: number;
    createdByName: string;
    createdDate: string; // ISO date string
    status: "Pending" | "Approved" | "Rejected" | "Processing" | "Done"|"Partial Success"|"Success";
    referenceNumber: string;
    totalCost: number;
    approvedDate: string | null;
    completedDate: string | null;
    originalImportId: number | null;
    
    importDetails: InventoryImportDetail[];
  }
  
  // Định nghĩa kết q
  
  export type FilterInventoryResponse = ApiResponse<PageResult<InventoryImportItem>>;
