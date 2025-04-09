// components/_staffcomponent/_dispatchrequest/DispatchStoreDetailClient.tsx
"use client";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  DispatchStoreDetail,
  DispatchStoreDetailResponse,
} from "@/type/dispatchStoreDetail";
import DispatchStoreDetailTable from "@/components/_staffcomponent/_dispatchrequest/DispatchStoreDetailTable";
import DispatchStoreDetailPagination from "@/components/_staffcomponent/_dispatchrequest/DispatchStoreDetailPagination";
import DispatchStoreDetailFilterDialog, {
  FilterData,
} from "@/components/_staffcomponent/_dispatchrequest/DispatchStoreDetailFilterDialog";
import { filterDispatchStoreDetails, updateFullStockDispatch } from "@/ultis/dispatch";
import CommentDialog from "@/components/_staffcomponent/_importreuquest/CommentDialog";

const DispatchStoreDetailClient: React.FC = () => {
  // --- 1) Đọc staffDetailId từ localStorage chỉ một lần ---
  const staffDetailId = useMemo(() => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem("account");
    if (!stored) return "";
    try {
      const acct = JSON.parse(stored);
      return acct.roleDetails?.staffDetailId?.toString() || "";
    } catch {
      return "";
    }
  }, []);

  // --- state chính ---
  const [data, setData] = useState<DispatchStoreDetail[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [filters, setFilters] = useState<FilterData>({
    DispatchDetailId: "",
    WarehouseId: "",
    StaffDetailId: staffDetailId, // khởi tạo luôn
    HandleBy: "",
    Status: "",
    Comments: "",
    SortBy: "",
    IsDescending: false,
    Page: "1",
    PageSize: "10",
  });

  const [sortField, setSortField] = useState("dispatchStoreDetailId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // --- dialog / comment state ---
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"FullStock" | "Shortage">("FullStock");
  const [selectedItem, setSelectedItem] = useState<DispatchStoreDetail | null>(null);

  // --- 2) fetchData được wrap trong useCallback, với đủ deps ---
  const fetchData = useCallback(async () => {
    try {
      const appliedFilters: FilterData = {
        ...filters,
        SortBy: sortField,
        IsDescending: sortDirection === "desc",
        StaffDetailId: staffDetailId,
        Page: page.toString(),
        PageSize: pageSize.toString(),
      };

      const response: DispatchStoreDetailResponse =
        await filterDispatchStoreDetails(page, pageSize, appliedFilters);

      setData(response.data);
      setTotalRecords(response.totalRecords);
    } catch (err) {
      console.error("Error fetching dispatch store details:", err);
      toast.error("Lỗi tải dữ liệu dispatch store details");
    }
  }, [
    filters,
    page,
    pageSize,
    sortField,
    sortDirection,
    staffDetailId,
  ]);

  // --- 3) Chỉ gọi fetchData trong effect, với [fetchData] là dep ---
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---
  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleFilterSubmit = (applied: FilterData) => {
    setFilters({
      ...applied,
      StaffDetailId: staffDetailId,
      Page: "1",
      PageSize: pageSize.toString(),
    });
    setPage(1);
    setFilterDialogOpen(false);
  };

  const handleSortChange = (field: string) => {
    const newDir = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDir);
    // reset page
    setPage(1);
  };

  const handleDone = (id: number, type: "FullStock" | "Shortage") => {
    const found = data.find((d) => d.dispatchStoreDetailId === id);
    if (!found) {
      toast.error("Không tìm thấy dữ liệu phù hợp.");
      return;
    }
    setSelectedItem(found);
    setActionType(type);
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = async (comment: string, actualQty: number) => {
    if (!selectedItem) return;

    try {
      const dispatchId = selectedItem.dispatchId;
      if (!dispatchId) {
        toast.error("Không tìm thấy dispatchId.");
        return;
      }

      const details = [
        {
          storeDetailId: selectedItem.dispatchStoreDetailId,
          actualReceivedQuantity:
            actionType === "FullStock"
              ? selectedItem.allocatedQuantity
              : actualQty,
          comment,
        },
      ];

      const result = await updateFullStockDispatch(
        dispatchId,
        parseInt(staffDetailId, 10),
        details
      );

      if (result?.status) {
        toast.success(`${actionType} update: ${result.data}`);
        fetchData();
      } else {
        toast.error(result?.message || "Update failed");
      }
    } catch (err: any) {
      console.error("API error:", err);
      toast.error(err.response?.data?.message || "Lỗi xảy ra!");
    } finally {
      setIsCommentDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Dispatch Store Details
        </Typography>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>

        {data.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DispatchStoreDetailTable
            data={data}
            onSortChange={handleSortChange}
            sortField={sortField}
            sortDirection={sortDirection}
            onFullStock={(id) => handleDone(id, "FullStock")}
            onAssign={(id) => toast.success(`Assign ${id}`)}
          />
        )}

        <DispatchStoreDetailPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      <DispatchStoreDetailFilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleFilterSubmit}
        initialFilters={filters}
      />

      <CommentDialog
        open={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        onSubmit={handleSubmitComment}
        actionType={actionType}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default DispatchStoreDetailClient;
