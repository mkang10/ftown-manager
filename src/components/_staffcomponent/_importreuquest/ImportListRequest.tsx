"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import { Box, Paper, Typography, Button, Alert, Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { filterStaffInventoryImports } from "@/ultis/importapi";
import {
  StaffImportFilterDto,
  StaffInventoryImportStoreDetailDto,
} from "@/type/importStaff";
import StaffFilterForm, { StaffFilterFormData } from "@/components/_staffcomponent/_importreuquest/StaffFilterForm";
import StaffImportRequestTable from "@/components/_staffcomponent/_importreuquest/StaffImportRequestTable";
import EmptyState from "@/components/_loading/EmptyState";

const defaultFilters = {
  StaffDetailId: 0,
  Status: undefined,
  SortBy: "importStoreId",
  IsDescending: false,
  Page: 1,
  PageSize: 10,
};

const ImportListRequest: React.FC = () => {
  const [staffImportRequests, setStaffImportRequests] = useState<StaffInventoryImportStoreDetailDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  // 1) Tạo initialFilters bằng useMemo, đọc localStorage 1 lần
  const initialFilters = useMemo<StaffImportFilterDto>(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("account");
    const staffId = stored
      ? JSON.parse(stored).roleDetails?.staffDetailId ?? 0
      : 0;
    return { ...defaultFilters, StaffDetailId: staffId };
  }, []);

  // 2) Khởi tạo state filters từ initialFilters
  const [filters, setFilters] = useState<StaffImportFilterDto>(initialFilters);

  // 3) Wrap fetchData trong useCallback, không phụ thuộc vào `filters`
  const fetchData = useCallback(
    async (customFilters: StaffImportFilterDto, skipLoading = false) => {
      if (!skipLoading) setLoading(true);
      setError("");

      try {
        const apiFilters = {
          ...customFilters,
          staffId: customFilters.StaffDetailId,
        };
        const response = await filterStaffInventoryImports(apiFilters);

        if (response.status) {
          setStaffImportRequests(response.data.data);
          setTotalCount(response.data.totalRecords);
        } else {
          setError(response.message || "Error fetching data");
        }
      } catch (err) {
        setError("Error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 4) Chỉ gọi fetchData(initialFilters) trong effect, deps = [fetchData, initialFilters]
  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData, initialFilters]);

  // refresh, filter, pagination, sort handlers
  const refreshData = () => fetchData(filters, true);

  const handleFilterSubmit = (data: StaffFilterFormData) => {
    const nf = { ...data, StaffDetailId: filters.StaffDetailId };
    setFilters(nf);
    fetchData(nf);
    setFilterOpen(false);
  };

  const handlePageChange = (_: any, page: number) => {
    const nf = { ...filters, Page: page };
    setFilters(nf);
    fetchData(nf);
  };

  const handleSortChange = (sortField: string, isDescending: boolean) => {
    const nf = { ...filters, SortBy: sortField, IsDescending: isDescending, Page: 1 };
    setFilters(nf);
    fetchData(nf);
  };

  const totalPages = Math.ceil(totalCount / (filters.PageSize || 10));

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Staff Inventory Import Requests
            </Typography>
            <Button variant="outlined" onClick={() => setFilterOpen(true)}>
              Filter
            </Button>
          </Box>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && staffImportRequests.length === 0 ? (
          <EmptyState loading={false} />
        ) : (
          <StaffImportRequestTable
  items={staffImportRequests}
  loading={loading}
  onSortChange={handleSortChange}
  sortBy={filters.SortBy ?? "importStoreId"}      // fallback thành "importStoreId"
  isDescending={filters.IsDescending ?? false}     // fallback thành false
  refreshData={refreshData}
/>

        )}
      </Box>

      <StaffFilterForm
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onSubmit={handleFilterSubmit}
        initialFilters={filters}
      />

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          py: 2,
          boxShadow: 3,
          zIndex: 1300,
        }}
      >
        <Pagination
          count={totalPages}
          page={filters.Page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <ToastContainer />
    </>
  );
};

export default ImportListRequest;
