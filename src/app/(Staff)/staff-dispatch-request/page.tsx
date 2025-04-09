"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
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

export default function DispatchStoreDetailPage() {
  const [data, setData] = useState<DispatchStoreDetail[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"FullStock" | "Shortage">("FullStock");
  const [selectedItem, setSelectedItem] = useState<DispatchStoreDetail | null>(null);

  const handleDone = (id: number, type: "FullStock" | "Shortage") => {
    const foundItem = data.find((d) => d.dispatchStoreDetailId === id);
    if (!foundItem) {
      toast.error("Không tìm thấy dữ liệu phù hợp.");
      return;
    }
    setSelectedItem(foundItem);
    setActionType(type);
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = async (comment: string, actualReceivedQuantity: number) => {
    if (!selectedItem) return;

    try {
      const storedAccount = localStorage.getItem("account");
      const dispatchid = selectedItem.dispatchId 
      let staffId = 0;

      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        staffId = account.roleDetails?.staffDetailId || 0;
      }

      if (!dispatchid) {
        toast.error("Không tìm thấy dispatchId.");
        return;
      }

      const details = [
        {
          storeDetailId: selectedItem.dispatchStoreDetailId,
          actualReceivedQuantity:
            actionType === "FullStock"
              ? selectedItem.allocatedQuantity
              : actualReceivedQuantity,
          comment,
        },
      ];

      let result;
      if (actionType === "FullStock") {
        result = await updateFullStockDispatch(dispatchid, staffId, details);
      }
      // else {
      //   result = await updateShortage(dispatchId, staffId, details);
      // }

      if (result?.status) {
        toast.success(`${actionType} update: ${result.data}`);
        await fetchData();
      } else {
        toast.error(result?.message || "Update failed");
      }
    } catch (error: any) {
      console.error("API error:", error);
      const message = error.response?.data?.message || "Lỗi xảy ra!";
      toast.error(message);
    } finally {
      setIsCommentDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const [filters, setFilters] = useState<FilterData>({
    DispatchDetailId: "",
    WarehouseId: "",
    StaffDetailId: "",
    HandleBy: "",
    Status: "",
    Comments: "",
    SortBy: "",
    IsDescending: false,
    Page: "1",
    PageSize: "10",
  });

  const [sortField, setSortField] = useState<string>("dispatchStoreDetailId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchData = async (customFilters?: FilterData) => {
    try {
      const storedAccount = localStorage.getItem("account");
      let staffDetailId = "";

      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        staffDetailId = account.roleDetails?.staffDetailId?.toString() || "";
      }

      const appliedFilters: FilterData = {
        ...filters,
        ...customFilters,
        SortBy: sortField,
        IsDescending: sortDirection === "desc",
        StaffDetailId: staffDetailId,
      };

      const response: DispatchStoreDetailResponse =
        await filterDispatchStoreDetails(page, pageSize, appliedFilters);

      setData(response.data);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      console.error("Error fetching dispatch store details:", error);
      toast.error("Lỗi tải dữ liệu dispatch store details");
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters, sortField, sortDirection]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    const newFilters = { ...filters, Page: newPage.toString() };
    setFilters(newFilters);
    setPage(newPage);
    fetchData(newFilters);
  };

  const handleFilterSubmit = (appliedFilters: FilterData) => {
    appliedFilters.Status = "Approved";
    setFilters({ ...appliedFilters, Page: "1" });
    setPage(1);
    fetchData({ ...appliedFilters, Page: "1" });
  };

  const handleSortChange = (field: string) => {
    let newDirection: "asc" | "desc" = "asc";
    if (sortField === field && sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortField(field);
    setSortDirection(newDirection);
    const newFilters = {
      ...filters,
      SortBy: field,
      IsDescending: newDirection === "desc",
      Page: "1",
    };
    setFilters(newFilters);
    setPage(1);
    fetchData(newFilters);
  };

  const handleAssign = (dispatchStoreDetailId: number) => {
    toast.success(`Assign dispatch store detail ${dispatchStoreDetailId}`);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <DashboardLayoutStaff>
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
            onAssign={handleAssign}
            onFullStock={(id) => handleDone(id, "FullStock")}
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
    </DashboardLayoutStaff>
  );
}
