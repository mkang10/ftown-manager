"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DasboardLayout";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Alert } from "@mui/material";
import { filterInventoryImports } from "@/ultis/importapi";
import { InventoryImportItem } from "@/type/InventoryImport";
import FilterDialog, { FilterData } from "@/components/_inventory/_import/FilterForm";
import StaffAssignHeader from "@/components/_staff-assign/StaffAssignHeader";
import StaffAssignTable from "@/components/_staff-assign/StaffAssignTable";
import StaffAssignPagination from "@/components/_staff-assign/StaffAssignPagination";
import StaffAssignDialog from "@/components/_staff-assign/StaffAssignDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffAssignPage: React.FC = () => {
  const router = useRouter();
  const [inventoryImports, setInventoryImports] = useState<InventoryImportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [filters, setFilters] = useState<FilterData>({
    CreatedBy: "",
    CreatedDateFrom: "",
    CreatedDateTo: "",
    ReferenceNumber: "",
    TotalCostMin: "",
    TotalCostMax: "",
    ApprovedDateFrom: "",
    ApprovedDateTo: "",
    CompletedDateFrom: "",
    CompletedDateTo: "",
    PageNumber: "1",
    PageSize: "10",
  });

  // State cho dialog gán nhân viên
  const [assignDialogOpen, setAssignDialogOpen] = useState<boolean>(false);
  const [selectedImportId, setSelectedImportId] = useState<number | null>(null);

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      const shopManagerId = account.roleDetails?.shopManagerId?.toString() || "";
      const newFilters = {
        ...filters,
        CreatedBy: account.accountId.toString(),
        Status: "Approved",
        HandleBy: shopManagerId,
      };
      setFilters(newFilters);
      fetchData(newFilters);
    } else {
      fetchData(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (customFilters?: FilterData) => {
    setLoading(true);
    setError("");
    try {
      const appliedFilters: FilterData = {
        ...customFilters!,
        Status: "Approved",
      };
      const response = await filterInventoryImports(appliedFilters);
      if (response.status) {
        setInventoryImports(response.data.data);
       
      } else {
        setError(response.message || "Error fetching data");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = (appliedFilters: FilterData) => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      const shopManagerId = account.roleDetails?.shopManagerId?.toString() || "";
      appliedFilters.CreatedBy = account.accountId.toString();
      appliedFilters.HandleBy = shopManagerId;
    }
    appliedFilters.Status = "Approved";
    setFilters(appliedFilters);
    fetchData(appliedFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, PageNumber: page.toString() };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  // Khi nhấn "Assign" ở bảng, mở dialog gán nhân viên
  const handleAssign = (importId: number) => {
    setSelectedImportId(importId);
    setAssignDialogOpen(true);
  };

  // Khi gán nhân viên thành công, hiển thị toast và refresh dữ liệu
  const handleAssigned = () => {
    toast.success("Nhân viên đã được gán thành công!", { position: "top-right", autoClose: 3000 });
    fetchData(filters);
  };

  const totalPages = Math.ceil(totalCount / Number(filters.PageSize));
  const currentPage = Number(filters.PageNumber);

  return (
    <DashboardLayout>
      <Box sx={{ p: 4 }}>
        <StaffAssignHeader onOpenFilter={handleOpenFilterDialog} />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <StaffAssignTable items={inventoryImports} onAssign={handleAssign} />
        )}
      </Box>
      <FilterDialog
        open={filterDialogOpen}
        onClose={handleCloseFilterDialog}
        onSubmit={handleApplyFilters}
        initialFilters={filters}
        showStatusFilter={false} // ẩn filter status
      />
      <StaffAssignPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {selectedImportId !== null && (
        <StaffAssignDialog
          open={assignDialogOpen}
          importId={selectedImportId}
          onClose={() => setAssignDialogOpen(false)}
          onAssigned={handleAssigned}
        />
      )}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default StaffAssignPage;
