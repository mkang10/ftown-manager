export interface StaffInventoryImportStoreDetailDto {
  importStoreId: number;
  importId: number;
  importDetailId: number;
  wareHouseId: number;
  allocatedQuantity: number;
  // Chỉ cho phép các giá trị "Success", "Processing", "Failed"
  status: "Success" | "Processing" | "Failed";
  comments?: string;
  staffDetailId?: number;
  wareHouseName: string;
  staffName?: string;
  productName : string;
  sizeName : string;
  colorName : string;
  actualReceivedQuantity? : number;
}

export interface StaffImportFilterDto {
  StaffDetailId: number;
  // Status bây giờ chỉ nhận "Success", "Processing", "Failed"
  Status?: "Success" | "Processing" | "Failed";
  SortBy?: string; // Ví dụ: "importStoreId", "wareHouseName", "status", "allocatedQuantity", "staffName"
  IsDescending?: boolean;
  Page?: number;
  PageSize?: number;
}

export interface FilterStaffInventoryResponse {
  data: {
    data: StaffInventoryImportStoreDetailDto[];
    totalRecords: number;
    page: number;
    pageSize: number;
  };
  status: boolean;
  message: string;
}

export interface FullStockDetail {
  storeDetailId: number;
  actualReceivedQuantity: number;
  comment: string;
}

export interface FullStockResponse {
  data: string; // Ví dụ: "Cập nhật Done thành công"
  status: boolean;
  message: string;
}