import { DispatchStoreDetailResponse } from "@/type/dispatchStoreDetail";
import adminClient from "./adminclient";

export const getDispatchStoreDetailById = async (
    dispatchStoreDetailId: number
  ): Promise<DispatchStoreDetailResponse> => {
    const response = await adminClient.get<DispatchStoreDetailResponse>(
      `/dispatch/export-store/${dispatchStoreDetailId}`
    );
    return response.data;
  };