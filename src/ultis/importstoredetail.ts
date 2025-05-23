import { ImportStoreDetailResponse } from "@/type/importstore";
import apiclient from "./apiclient";

export const getImportStoreDetailById = async (
  id: number
): Promise<ImportStoreDetailResponse> => {
  try {
    const response = await apiclient.get<ImportStoreDetailResponse>(
      `/importstoredetail/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching import store detail:", error);
    throw error;
  }
};
