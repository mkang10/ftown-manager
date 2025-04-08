"use client";
import React, { useEffect, useState } from "react";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography, Button, Alert, Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { filterStaffInventoryImports } from "@/ultis/importapi";
import { StaffImportFilterDto, StaffInventoryImportStoreDetailDto } from "@/type/importStaff";
import StaffFilterForm, { StaffFilterFormData } from "@/components/_staffcomponent/_importreuquest/StaffFilterForm";
import StaffImportRequestTable from "@/components/_staffcomponent/_importreuquest/StaffImportRequestTable";
import EmptyState from "@/components/_loading/EmptyState";

const StaffImportRequestPage: React.FC = () => {
  const router = useRouter();
  const [staffImportRequests, setStaffImportRequests] = useState<StaffInventoryImportStoreDetailDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<StaffImportFilterDto>({
    StaffDetailId: 0,
    Status: undefined,
    SortBy: "importStoreId",
    IsDescending: false,
    Page: 1,
    PageSize: 10,
  });

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      const newFilters: StaffImportFilterDto = {
        ...filters,
        StaffDetailId: account.roleDetails?.staffDetailId,
      };
      setFilters(newFilters);
      fetchData(newFilters);
    } else {
      fetchData(filters);
    }
  }, []);

  // Nếu skipLoading là true, không bật hiệu ứng loading
  const fetchData = async (customFilters: StaffImportFilterDto, skipLoading?: boolean) => {
    if (!skipLoading) setLoading(true);
    setError("");
    try {
      const apiFilters = { ...customFilters, staffId: customFilters.StaffDetailId };
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
  };

  const refreshData = () => {
    fetchData(filters, true);
  };

  const handleFilterSubmit = (data: StaffFilterFormData) => {
    const newFilters: StaffImportFilterDto = {
      ...data,
      StaffDetailId: filters.StaffDetailId,
    };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newFilters = { ...filters, Page: page };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const handleSortChange = (sortField: string, isDescending: boolean) => {
    const newFilters = { ...filters, SortBy: sortField, IsDescending: isDescending, Page: 1 };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const totalPages = Math.ceil(totalCount / (filters.PageSize || 10));

  return (
    <DashboardLayoutStaff>
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
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={() => setFilterOpen(true)}>
                Filter
              </Button>
            </Box>
          </Box>
        </Paper>
        {error && <Alert severity="error">{error}</Alert>}
        {(!loading && staffImportRequests.length === 0) ? (
          <EmptyState loading={false} />
        ) : (
          <StaffImportRequestTable
            items={staffImportRequests}
            loading={loading}
            onSortChange={handleSortChange}
            sortBy={filters.SortBy || "importStoreId"}
            isDescending={filters.IsDescending || false}
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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={filters.Page || 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
      <ToastContainer />
    </DashboardLayoutStaff>
  );
};

export default StaffImportRequestPage;
