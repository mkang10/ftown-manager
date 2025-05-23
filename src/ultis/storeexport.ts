import { DispatchStoreDetailResponse } from "@/type/dispatchStoreDetail";
import apiclient from "./apiclient";

export const getDispatchStoreDetailById = async (
    dispatchStoreDetailId: number
  ): Promise<DispatchStoreDetailResponse> => {
    const response = await apiclient.get<DispatchStoreDetailResponse>(
      `/dispatch/export-store/${dispatchStoreDetailId}`
    );
    return response.data;
  };