// components/_inventory/_import/InventoryImportListClient.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Paper, Typography, Alert, Box, Button, Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { filterInventoryImports } from "@/ultis/importapi";
import { InventoryImportItem } from "@/type/InventoryImport";
import FilterDialog, { FilterData } from "@/components/_inventory/_import/FilterForm";
import InventoryImportTable from "@/components/_inventory/_import/InventoryImportTable";
import CreateInventoryImportModal from "@/components/_inventory/_import/_create/CreateInventoryImportModal";

const InventoryImportListClient: React.FC = () => {
  const router = useRouter();
  const [inventoryImports, setInventoryImports] = useState<InventoryImportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);

  const [filters, setFilters] = useState<FilterData>({
    Status: "",
    ReferenceNumber: "",
    FromDate: "",
    ToDate: "",
    SortBy: "ImportId",
    IsDescending: false,
    Page: 1,
    PageSize: 10,
  });

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      const newFilters = {
        ...filters,
        HandleBy: account.roleDetails?.shopManagerDetailId || "",
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
      const appliedFilters = customFilters || filters;
      const response = await filterInventoryImports(appliedFilters);
      if (response.status) {
        setInventoryImports(response.data.data);
        setTotalCount(response.data.totalRecords);
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
      appliedFilters.HandleBy = account.roleDetails?.shopManagerDetailId || "";
    }
    appliedFilters.Page = 1;
    setFilters(appliedFilters);
    fetchData(appliedFilters);
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

  // Callback từ modal khi tạo đơn thành công
  const handleCreationSuccess = () => {
    toast.success("Inventory Import created successfully!");
    // Reload trang import gốc
    fetchData(filters);
  };

  const totalPages = Math.ceil(totalCount / Number(filters.PageSize));

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight="bold">
              Inventory Imports
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={handleOpenFilterDialog}>
                Filter
              </Button>
              <Button variant="contained" onClick={() => setOpenModal(true)}>
                Create Inventory Import
              </Button>
              <CreateInventoryImportModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={handleCreationSuccess}
              />
            </Box>
          </Box>
        </Paper>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <InventoryImportTable
            items={inventoryImports}
            sortBy={filters.SortBy}
            isDescending={filters.IsDescending}
            onSortChange={handleSortChange}
          />
        )}
      </Box>
      <FilterDialog
        open={filterDialogOpen}
        onClose={handleCloseFilterDialog}
        onSubmit={handleApplyFilters}
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
            page={filters.Page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
};

export default InventoryImportListClient;
