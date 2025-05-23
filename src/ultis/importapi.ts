// /src/api/inventoryImportApi.ts
import {
  FilterInventoryResponse,
} from "@/type/InventoryImport";

// GET: Lấy danh sách Inventory Import
// /src/ultis/importapi.ts
import apiclient from "./apiclient";
import { productVariant } from "@/type/Product";
import { ImportDetailResponse } from "@/type/importdetail";
import { InventoryImportCreateRequest, InventoryImportCreateResponse } from "@/type/createInventoryImport";
import { FilterStaffInventoryResponse } from "@/type/importStaff";
import { FullStockResponse, FullStockDetail } from "@/type/importStaff";
import { ImportResponseDto } from "@/type/importdetailsm";




// POST: Tạo mới Inventory Import
export const createInventoryImport = async (
  data: InventoryImportCreateRequest
): Promise<InventoryImportCreateResponse> => {
  try {
    // Gửi request và nhận về blob (có thể là file hoặc JSON)
    const response = await apiclient.post<Blob>(
      "/inventoryimport/createtransfer",
      data,
      { responseType: "blob" }
    );

    const blob = response.data;
    const contentType = response.headers["content-type"] || "";

    // Trường hợp server trả về JSON (ví dụ import bị reject)
    if (contentType.includes("application/json")) {
      // Đọc blob thành text rồi parse JSON
      const text = await blob.text();
      const json = JSON.parse(text) as InventoryImportCreateResponse;
      return json;
    }

    // Ngược lại, server trả về file .docx — xử lý download
    // Lấy tên file từ header nếu có
    const contentDisposition = response.headers["content-disposition"];
    let filename = "PhieuNhap.docx";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, "");
      }
    }

    // Tạo URL cho blob và trigger download
    const blobUrl = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    // Trả về kết quả thành công
    return {
      status: true,
      message: "Tạo import thành công và file biên bản đã được tải về.",
      data: null,
    };
  } catch (error) {
    console.error("Error creating inventory import:", error);
    // Ném thẳng error ra cho caller tự xử lý (như toast trong handleSubmit)
    throw error;
  }
};

// Hàm filter inventory imports theo các trường filter (truyền vào dưới dạng FormData)
export const filterInventoryImports = async (
  filterData: Record<string, any>
): Promise<FilterInventoryResponse> => {
  try {
    const queryParams = new URLSearchParams();

    // Thêm các filter hợp lệ
    Object.keys(filterData).forEach((key) => {
      if (filterData[key] !== undefined && filterData[key] !== null && filterData[key] !== "") {
        queryParams.append(key, String(filterData[key]));
      }
    });

    // Lấy shopManagerDetailId từ localStorage
    const accountStr = localStorage.getItem("account");
    if (!accountStr) throw new Error("Không tìm thấy thông tin tài khoản trong localStorage");

    const account = JSON.parse(accountStr);
    const shopManagerDetailId = account?.roleDetails?.shopManagerDetailId;

    if (!shopManagerDetailId) throw new Error("Không tìm thấy shopManagerDetailId trong account");

    // Luôn gán HandleBy
    queryParams.set("HandleBy", shopManagerDetailId);

    const response = await apiclient.get<FilterInventoryResponse>(
      `/inventoryimport/get-all?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error filtering inventory imports:", error);
    throw error;
  }
};
export const getProductVariants = async (
  page: number = 1,
  pageSize: number = 5,
  search: string = ""
): Promise<{ data: productVariant[]; totalRecords: number }> => {
  try {
    const response = await apiclient.get<{
      data: {
        data: productVariant[];
        totalRecords: number;
        page: number;
        pageSize: number;
      };
      status: boolean;
      message: string;
    }>(
      `/inventoryimport/product`, 
      {
        params: { page, pageSize, search }
      }
    );
    if (response.data.status) {
      return {
        data: response.data.data.data,
        totalRecords: response.data.data.totalRecords,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error;
  }
};

export const getImportDetail = async (importId: number): Promise<ImportDetailResponse> => {
  try {
    // Gửi GET request với importId được đính kèm trong URL
    const response = await apiclient.get<ImportDetailResponse>(`/inventoryimport/${importId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching import detail:", error);
    throw error;
  }
};

export const filterStaffInventoryImports = async (
  filterData: Record<string, any>
): Promise<FilterStaffInventoryResponse> => {
  try {
    // Lấy StaffDetailId từ localStorage (nếu có)
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      const staffId = account.roleDetails?.staffDetailId;
      if (staffId) {
        filterData.StaffDetailId = staffId; // ✅ luôn truyền StaffDetailId vào filter
      }
    }

    // Tạo query string từ filterData
    const queryParams = new URLSearchParams();
    Object.keys(filterData).forEach((key) => {
      if (filterData[key] !== undefined && filterData[key] !== null && filterData[key] !== "") {
        queryParams.append(key, String(filterData[key]));
      }
    });

    const response = await apiclient.get<FilterStaffInventoryResponse>(
      `/inventoryimport/by-staff/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering staff inventory imports:", error);
    throw error;
  }
};


// ultis/importRequest.ts

export const updateFullStock = async (
  importId: number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  const url = `/inventoryimport/${importId}/done?staffId=${staffId}`;
  const response = await apiclient.post<FullStockResponse>(
    url,
    details,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const updateCancelled = async (
  importId: number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  // Endpoint cập nhật cancelled, thay updateLowStock
  const url = `/inventoryimport/${importId}/incompleted?staffId=${staffId}`;
  const response = await apiclient.post<FullStockResponse>(
    url,
    details,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const updateShortage = async (
  importId: number,
  staffId: number,
  details: FullStockDetail[]
): Promise<FullStockResponse> => {
  const url = `/inventoryimport/shortage?importId=${importId}&staffId=${staffId}`;
  const response = await apiclient.post<FullStockResponse>(
    url,
    details,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};
export const getImportById = async (
  importId: number
): Promise<ImportResponseDto> => {
  const response = await apiclient.get<{ data: ImportResponseDto }>(
    `/inventoryimport/${importId}`
  );
  return response.data.data;
};



export const importInventoryFromExcel = async (
  file: File,
  warehouseId: number | string,
  createdBy: number
): Promise<InventoryImportCreateResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('warehouseId', warehouseId.toString());
  formData.append('createdBy', createdBy.toString());

  // Luôn dùng blob để có thể đọc cả file lẫn JSON lỗi
  const response = await apiclient.post('/inventoryimport/createtransfer-from-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

  // Lấy content-type để phân biệt
  const contentType = response.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    // Server trả JSON (trường hợp đơn bị reject hoặc lỗi khác)
    const text = await response.data.text();
    const json = JSON.parse(text) as InventoryImportCreateResponse;
    return json;
  }

  // Ngược lại, server trả file docx → thực hiện download
  // Lấy tên file từ header nếu có
  const contentDisp = response.headers['content-disposition'] as string | undefined;
  let filename = 'PhieuNhap.docx';
  if (contentDisp) {
    const match = contentDisp.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, '');
    }
  }

  // Tạo URL blob và trigger download
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);

  // Trả về response thành công
  return {
    status: true,
    message: 'Tạo import thành công và file biên bản đã được tải về.',
    data: null,
  };
};

