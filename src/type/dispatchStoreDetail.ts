export interface DispatchStoreDetail {
    dispatchStoreDetailId: number;
    dispatchId :number;
    warehouseId: number;
    warehouseName: string | null;
    staffDetailId: number | null;
    staffName: string | null;
    allocatedQuantity: number;
    actualQuantity: number | null;
    status: string;
    comments: string;
  }
  
  export interface DispatchStoreDetailResponse {
    data: DispatchStoreDetail[];
    totalRecords: number;
    page: number;
    pageSize: number;
  }
  