// New types cho create API (có thể thêm vào file /src/types/inventoryImport.ts)
// Ví dụ trong /src/type/createInventoryImport.ts
export interface InventoryImportCreateRequest {
  createdBy: number;
  handleBy: number;
  originalImportId: number | null;
  importDetails: {
    productVariantId: number;
    costPrice: number;
    quantity: number;
    storeDetails: { wareHouseId: number; allocatedQuantity: number;handleBy: number }[];
  }[];
}

  export interface InventoryImportCreateResponse {
    data: {
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
      handleBy: number | null;
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
        }[];
      }[];
    };
    status: boolean;
    message: string;
  }
  