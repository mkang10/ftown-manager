import { DispatchResponse } from "@/type/dispatchnew";
import shopmanagerclient from "./ShopmanagerClient";

export const getDispatchByStaff = async (
    params: {
      StaffDetailId?: number;
      Status?: string;
      SortBy?: string;
      IsDescending?: boolean;
      Page?: number;
      PageSize?: number;
    }
  ): Promise<DispatchResponse> => {
    const response = await shopmanagerclient.get<DispatchResponse>(
      "/dispatch/by-staff",
      { params }
    );
    return response.data;
  };