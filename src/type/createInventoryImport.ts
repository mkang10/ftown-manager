// New types cho create API (có thể thêm vào file /src/types/inventoryImport.ts)
// Ví dụ trong /src/type/createInventoryImport.ts
export interface InventoryImportCreateRequest {
  createdBy: number;
  handleBy: number;
  originalImportId: number | null;
  isUrgent: boolean,
  wareHouseId: number,

  importDetails: {
    productVariantId: number;
    costPrice: number;
    quantity: number;
    storeDetails: {  allocatedQuantity: number;handleBy: number }[];
  }[];
}

export interface InventoryImportCreateResponse {
  data?: {
    importId: number;
    createdByName: string | null;
    createdBy: number;
    createdDate: string;
    status: string;
    referenceNumber: string;
    totalCost: number;
    approvedDate: string | null;
    completedDate: string | null;
    originalImportId: number | null;
    handleByName: string | null;
    importDetails: {
      importDetailId: number;
      importId: number;
      productVariantId: number;
      quantity: number;
      importStoreDetails: {
        importDetailId: number;
        wareHouseId: number;
        allocatedQuantity: number;
        status: string;
        comments: string | null;
        staffDetailId: number | null;
        storeImportStoreId: number;
        handleBy: number | null;
      }[];
    }[];
  } | null;
  status: boolean;
  message: string;
}