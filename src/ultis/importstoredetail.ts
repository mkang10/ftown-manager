import { ImportStoreDetailResponse } from "@/type/importstore";
import adminClient from "./adminclient";

export const getImportStoreDetailById = async (
  id: number
): Promise<ImportStoreDetailResponse> => {
  try {
    const response = await adminClient.get<ImportStoreDetailResponse>(
      `/importstoredetail/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching import store detail:", error);
    throw error;
  }
};
