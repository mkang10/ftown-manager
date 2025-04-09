export interface ExportDetail {
    dispatchStoreDetailId: number;
    warehouseId: number;
    warehouseName: string | null;
    staffDetailId: number | null;
    staffName: string | null;
    allocatedQuantity: number;
    actualQuantity: number | null;
    status: string;
    comments: string;
  }
  
  export interface DispatchDetail {
    dispatchDetailId: number;
    variantId: number;
    productName: string;
    quantity: number;
    exportDetails: ExportDetail[];
  }
  
  export interface Dispatch {
    dispatchId: number;
    status: string;
    referenceNumber: string;
    remarks: string;
    createdDate: string;
    createdByName: string;
    completedDate: string | null;
    dispatchDetails: DispatchDetail[];
  }
  
  export interface DispatchResponse {
    data: Dispatch[];
    totalRecords: number;
    page: number;
    pageSize: number;
  }
  