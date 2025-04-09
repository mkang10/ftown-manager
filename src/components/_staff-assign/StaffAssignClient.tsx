// app/staff-assign/StaffAssignClient.tsx
'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Alert } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { filterInventoryImports } from "@/ultis/importapi";
import { InventoryImportItem } from "@/type/InventoryImport";
import FilterDialog, { FilterData } from "@/components/_inventory/_import/FilterForm";
import StaffAssignHeader from "@/components/_staff-assign/StaffAssignHeader";
import StaffAssignTable from "@/components/_staff-assign/StaffAssignTable";
import StaffAssignPagination from "@/components/_staff-assign/StaffAssignPagination";
import StaffAssignDialog from "@/components/_staff-assign/StaffAssignDialog";

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

  useEffect(() => {
    const stored = localStorage.getItem("account");
    let initial = { ...filters, Status: "Approved" } as FilterData;
    if (stored) {
      const acc = JSON.parse(stored);
      initial.CreatedBy = acc.accountId.toString();
      initial.HandleBy = acc.roleDetails?.shopManagerId?.toString() || "";
    }
    setFilters(initial);
    fetchData(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (applied: FilterData) => {
    setLoading(true);
    setError("");
    try {
      const resp = await filterInventoryImports(applied);
      if (resp.status) {
        setInventoryImports(resp.data.data);
        setTotalCount(resp.data.totalRecords ?? 0);
      } else {
        setError(resp.message || "Error fetching data");
      }
    } catch {
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (applied: FilterData) => {
    const stored = localStorage.getItem("account");
    if (stored) {
      const acc = JSON.parse(stored);
      applied.CreatedBy = acc.accountId.toString();
      applied.HandleBy = acc.roleDetails?.shopManagerId?.toString() || "";
    }
    applied.Status = "Approved";
    setFilters(applied);
    fetchData(applied);
  };

  const handlePageChange = (page: number) => {
    const next = { ...filters, PageNumber: page.toString() };
    setFilters(next);
    fetchData(next);
  };

  const handleAssign = (importId: number) => {
    setSelectedImportId(importId);
    setAssignDialogOpen(true);
  };

  const handleAssigned = () => {
    toast.success("Nhân viên đã được gán thành công!", { position: "top-right", autoClose: 3000 });
    fetchData(filters);
  };

  const totalPages = Math.ceil(totalCount / Number(filters.PageSize));
  const currentPage = Number(filters.PageNumber);

  return (
    <>
      <Box sx={{ p: 4 }}>
        <StaffAssignHeader onOpenFilter={() => setFilterDialogOpen(true)} />
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
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleApplyFilters}
        initialFilters={filters}
        showStatusFilter={false}
      />

      <StaffAssignPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedImportId !== null && (
        <StaffAssignDialog
          open={assignDialogOpen}
          importId={selectedImportId}
          onClose={() => setAssignDialogOpen(false)}
          onAssigned={handleAssigned}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default StaffAssignClient;
