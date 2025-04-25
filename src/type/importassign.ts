// Kiểu dữ liệu cho 1 bản ghi import
export interface InventoryImportRecord {
  importId: number;
  importDetailId: number;
  wareHouseId: number;
  warehouseName: string;
  actualReceivedQuantity: number;
  allocatedQuantity: number;
  status: string;
  comments: string;
  staffDetailId: number;
  importStoreId: number;
  handleBy: number;
  handleByName: string;
  productName: string;
  sizeName: string;
  colorName: string;
}

// Kiểu dữ liệu cho response của API
export interface FilterStaffInventoryResponse {
  data: {
    data: InventoryImportRecord[];
    totalRecords: number;
    page: number;
    pageSize: number;
  };
  status: boolean;
  message: string;
}