"use client";

import React, { useEffect, useState, useCallback } from "react";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  TableContainer,
  Paper,
  CircularProgress,
  Pagination,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FilterList as FilterListIcon, Refresh as RefreshIcon } from "@mui/icons-material";
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

// Container with white background and padding
const Container = styled(Box)(() => ({
  backgroundColor: '#ffffff',
  minHeight: '100vh',
  padding: '32px',
}));

// Header layout
const Header = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
}));

// Filter panel styling
const FilterCard = styled(Card)(() => ({
  marginBottom: '24px',
  borderRadius: '12px',
  border: '1px solid #000',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

// Base button for actions
const BaseButton = styled(Button)(() => ({
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '6px 16px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.1s, box-shadow 0.1s',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

// Icon buttons for filter/refresh
const ActionIconButton = styled(IconButton)(() => ({
  backgroundColor: '#fff',
  border: '1px solid #000',
  padding: '8px',
  '& svg': { color: '#000' },
  '&:hover': {
    backgroundColor: '#000',
    '& svg': { color: '#fff' },
  },
}));

// Primary action button
const ActionButton = styled(BaseButton)(() => ({
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
}));

const ImportListRequest: React.FC = () => {
  const [items, setItems] = useState<StaffInventoryImportStoreDetailDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [filters, setFilters] = useState<StaffImportFilterDto>(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('account');
    const staffId = stored ? JSON.parse(stored).roleDetails?.staffDetailId ?? 0 : 0;
    return {
      StaffDetailId: staffId,
      Status: undefined,
      SortBy: "importStoreId",
      IsDescending: true,
      Page: 1,
      PageSize: 10,
    };
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const apiFilters = {
        ...filters,
        Status: statusFilter !== 'All' ? statusFilter : undefined,
        staffId: filters.StaffDetailId,
      };
      const response = await filterStaffInventoryImports(apiFilters);
      if (response.status) {
        setItems(response.data.data);
        setTotal(response.data.totalRecords);
      } else {
        setError(response.message || "Lỗi khi tải dữ liệu");
      }
    } catch {
      setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [filters, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = () => fetchData();
  const handleFilterSubmit = (data: StaffFilterFormData) => {
    const nf = { ...filters, ...data, StaffDetailId: filters.StaffDetailId };
    setFilters(nf);
    setStatusFilter(data.Status ?? 'All');
    setFiltersOpen(false);
    fetchData();
  };

  const handlePageChange = (_: any, page: number) => {
    const nf = { ...filters, Page: page };
    setFilters(nf);
    fetchData();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Container>
        <Header>
          <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Inter', color: '#111' }}>
            Yêu cầu nhập kho của nhân viên
          </Typography>
          <Stack direction="row" spacing={1}>
            <ActionIconButton onClick={() => setFiltersOpen(!filtersOpen)}>
              <FilterListIcon />
            </ActionIconButton>
            <ActionIconButton onClick={refreshData}>
              <RefreshIcon />
            </ActionIconButton>
          </Stack>
        </Header>

        {filtersOpen && (
          <FilterCard>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
             
            </CardContent>
          </FilterCard>
        )}

        {error && (
          <Typography color="error" mb={2}>{error}</Typography>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={60} />
          </Box>
        ) : items.length === 0 ? (
          <EmptyState loading={false} />
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 4, mb: 4 }}>
            <StaffImportRequestTable
              items={items}
              loading={loading}
              onSortChange={(sortBy, isDesc) => {
                const nf = { ...filters, SortBy: sortBy, IsDescending: isDesc, Page: 1 };
                setFilters(nf);
                fetchData();
              }}
              sortBy={filters.SortBy!}
              isDescending={filters.IsDescending!}
              refreshData={refreshData}
            />
          </TableContainer>
        )}

        <Box display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(total / (filters.PageSize!))}
            page={filters.Page!}
            onChange={handlePageChange}
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      </Container>
    </>
  );
};

export default ImportListRequest;
