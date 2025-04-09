"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DasboardLayout";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Dispatch } from "@/type/dispatch";

import DispatchFilterDialog, {
  DispatchFilterData,
} from "@/components/_dispatch/DispatchFilterDialog";
import DispatchTable from "@/components/_dispatch/DispatchTable";
import DispatchPagination from "@/components/_dispatch/DispatchPagination";
import EmptyState from "@/components/_loading/EmptyState";
import { getDispatches } from "@/ultis/dispatch";
import DispatchHeader from "@/components/_dispatch/DispatchTableHeader";

const DispatchPage: React.FC = () => {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [filters, setFilters] = useState<DispatchFilterData>({
    referenceNumber: "",
    createdByName: "",
    fromDate: "",
    toDate: "",
    completedFrom: "",
    completedTo: "",
  });

  // Lần đầu load
  useEffect(() => {
    fetchData(filters, page, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (
    f: DispatchFilterData,
    pg: number,
    skipLoading?: boolean
  ) => {
    if (!skipLoading) setLoading(true);
    setError("");

    try {
      const apiFilters: Record<string, any> = {};
      if (f.referenceNumber) apiFilters.ReferenceNumber = f.referenceNumber;
      if (f.createdByName) apiFilters.CreatedByName = f.createdByName;
      if (f.fromDate) apiFilters.FromDate = f.fromDate;
      if (f.toDate) apiFilters.ToDate = f.toDate;
      if (f.completedFrom) apiFilters.CompletedFrom = f.completedFrom;
      if (f.completedTo) apiFilters.CompletedTo = f.completedTo;

      const resp = await getDispatches(pg, pageSize, apiFilters);
      setDispatches(resp.data);
      setTotalCount(resp.totalRecords);
    } catch (err: any) {
      setError(err.message || "Có lỗi khi tải danh sách dispatch");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (f: DispatchFilterData) => {
    setFilters(f);
    setPage(1);
    fetchData(f, 1);
    setFilterDialogOpen(false);
  };

  const handlePageChange = (pg: number) => {
    setPage(pg);
    fetchData(filters, pg, true);
  };

  const refreshData = () => {
    fetchData(filters, page, true);
    toast.success("Gán nhân viên thành công", { autoClose: 1000 });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <DashboardLayout>
      <Box sx={{ p: 4 }}>
        <DispatchHeader
          onOpenFilter={() => setFilterDialogOpen(true)}
          onRefresh={refreshData}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : dispatches.length === 0 ? (
          <EmptyState loading={false} />
        ) : (
          <DispatchTable items={dispatches} onRefresh={refreshData} />
        )}
      </Box>

      <DispatchFilterDialog
        open={filterDialogOpen}
        initialFilters={filters}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleApplyFilters}
      />

      <DispatchPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ToastContainer />
    </DashboardLayout>
  );
};

export default DispatchPage;
