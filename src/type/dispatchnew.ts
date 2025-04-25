export interface DispatchStoreDetail {
    dispatchId:number;
    dispatchStoreDetailId: number;
    warehouseId: number;
    warehouseName: string;
    actualQuantity?: number | null;
    allocatedQuantity: number;
    status: string;
    comments: string;
    staffDetailId?: number | null;
    dispatchDetailId: number;
    handleBy: number;
    handleByName: string;
    productName: string;
    sizeName: string;
    colorName: string;
  }
  
  export interface DispatchResponse {
    data: {
      data: DispatchStoreDetail[];
      totalRecords: number;
      page: number;
      pageSize: number;
    };
    status: boolean;
    message: string;
  }