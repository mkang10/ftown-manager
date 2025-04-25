"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { filterStaffInventoryImports } from "@/ultis/importapi";
import {
  StaffImportFilterDto,
  StaffInventoryImportStoreDetailDto,
} from "@/type/importStaff";
import StaffFilterForm, {
  StaffFilterFormData,
} from "@/components/_staffcomponent/_importreuquest/StaffFilterForm";
import StaffImportRequestTable from "@/components/_staffcomponent/_importreuquest/StaffImportRequestTable";
import EmptyState from "@/components/_loading/EmptyState";

const defaultFilters = {
  StaffDetailId: 0,
  Status: undefined,
  SortBy: "importStoreId",
  IsDescending: true,
  Page: 1,
  PageSize: 10,
};

const ImportListRequest: React.FC = () => {
  const [staffImportRequests, setStaffImportRequests] = useState<
    StaffInventoryImportStoreDetailDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const initialFilters = useMemo<StaffImportFilterDto>(() => {
    const stored =
      typeof window !== "undefined" && localStorage.getItem("account");
    const staffId = stored
      ? JSON.parse(stored).roleDetails?.staffDetailId ?? 0
      : 0;
    return { ...defaultFilters, StaffDetailId: staffId };
  }, []);

  const [filters, setFilters] = useState<StaffImportFilterDto>(initialFilters);

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
          setError(response.message || "Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(initialFilters);
  }, [fetchData, initialFilters]);

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
    const nf = {
      ...filters,
      SortBy: sortField,
      IsDescending: isDescending,
      Page: 1,
    };
    setFilters(nf);
    fetchData(nf);
  };

  const totalPages = Math.ceil(totalCount / (filters.PageSize || 10));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 2,
          backgroundColor: "#fff",
          borderRadius: 3,
          border: "1px solid #000",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="bold"
            sx={{ fontFamily: "'Roboto Slab', serif", color: "#000" }}
          >
            Yêu cầu nhập kho của nhân viên
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "#000",
              borderColor: "#000",
              fontWeight: 600,
              ":hover": {
                backgroundColor: "#000",
                color: "#fff",
              },
            }}
            onClick={() => setFilterOpen(true)}
          >
            Bộ lọc
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && staffImportRequests.length === 0 ? (
        <EmptyState loading={false} />
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <StaffImportRequestTable
            items={staffImportRequests}
            loading={loading}
            onSortChange={handleSortChange}
            sortBy={filters.SortBy ?? "importStoreId"}
            isDescending={filters.IsDescending ?? false}
            refreshData={refreshData}
          />
        </Box>
      )}

      <StaffFilterForm
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onSubmit={handleFilterSubmit}
        initialFilters={filters}
      />

      <Box
        sx={{
          position: { xs: "static", md: "fixed" },
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          py: 2,
          boxShadow: 3,
          zIndex: 1300,
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid #000",
          mt: { xs: 2, md: 0 },
        }}
      >
        <Pagination
          count={totalPages}
          page={filters.Page}
          onChange={handlePageChange}
          size={isMobile ? "small" : "medium"}
          color="primary"
        />
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default ImportListRequest;