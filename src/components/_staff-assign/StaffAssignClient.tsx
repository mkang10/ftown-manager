'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Alert, Paper, styled } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { filterInventoryImports } from "@/ultis/importapi";
import { InventoryImportItem } from "@/type/InventoryImport";
import FilterDialog, { FilterData } from "@/components/_inventory/_import/FilterForm";
import StaffAssignHeader from "@/components/_staff-assign/StaffAssignHeader";
import StaffAssignTable from "@/components/_staff-assign/StaffAssignTable";
import StaffAssignPagination from "@/components/_staff-assign/StaffAssignPagination";
import StaffAssignDialog from "@/components/_staff-assign/StaffAssignDialog";

// Styled components cho giao diện trắng đen mỹ thuật
const Container = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid #000',
}));

const LoadingWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  margin: '24px 0',
}));

const StyledAlert = styled(Alert)(() => ({
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #000',
  margin: '16px 0',
}));

const StaffAssignClient: React.FC = () => {
  const router = useRouter();

  const [inventoryImports, setInventoryImports] = useState<InventoryImportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState<boolean>(false);
  const [selectedImportId, setSelectedImportId] = useState<number | null>(null);

  const [totalCount, setTotalCount] = useState<number>(0);

  const [filters, setFilters] = useState<FilterData>({
    Status: "Approved",
    ReferenceNumber: "",
    FromDate: "",
    ToDate: "",
    SortBy: "ImportId",
    IsDescending: false,
    Page: 1,
    PageSize: 10,
    HandleBy: undefined,
  });

  const fetchData = async (applied: FilterData) => {
    setLoading(true);
    setError("");
    try {
      const accStr = localStorage.getItem("account");
      const acc = accStr ? JSON.parse(accStr) : {};
      const payload = { ...applied, HandleBy: acc.roleDetails?.shopManagerId };

      const resp = await filterInventoryImports(payload);
      if (resp.status) {
        setInventoryImports(resp.data.data);
        setTotalCount(resp.data.totalRecords ?? 0);
      } else {
        setError(resp.message || "Không thể tải dữ liệu.");
      }
    } catch {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = (applied: FilterData) => {
    const next = { ...filters, ...applied, Page: 1 };
    setFilters(next);
    fetchData(next);
  };

  const handlePageChange = (page: number) => {
    const next = { ...filters, Page: page };
    setFilters(next);
    fetchData(next);
  };

  const handleAssign = (importId: number) => {
    setSelectedImportId(importId);
    setAssignDialogOpen(true);
  };

  const handleAssigned = () => {
    toast.success("Nhân viên được gán thành công!", { position: "top-right", autoClose: 3000 });
    fetchData(filters);
  };

  const totalPages = Math.ceil(totalCount / (filters.PageSize || 1));
  const currentPage = filters.Page || 1;

  return (
    <Container>
      {/* Header với filter */}
      <Box sx={{ mb: 2 }}>
        <StaffAssignHeader onOpenFilter={() => setFilterDialogOpen(true)} />
      </Box>

      {/* Nội dung chính */}
      {loading ? (
        <LoadingWrapper>
          <CircularProgress size={48} sx={{ color: '#000' }} />
        </LoadingWrapper>
      ) : error ? (
        <StyledAlert severity="error">{error}</StyledAlert>
      ) : (
        <StaffAssignTable items={inventoryImports} onAssign={handleAssign} />
      )}

      {/* phân trang */}
      <Box sx={{ mt: 3 }}>
        <StaffAssignPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleApplyFilters}
        initialFilters={filters}
        showStatusFilter={false}
      />

      {/* Assign Dialog */}
      {selectedImportId !== null && (
        <StaffAssignDialog
          open={assignDialogOpen}
          importId={selectedImportId}
          onClose={() => setAssignDialogOpen(false)}
          onAssigned={handleAssigned}
        />
      )}

      {/* Toast thông báo */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  );
};

export default StaffAssignClient;
