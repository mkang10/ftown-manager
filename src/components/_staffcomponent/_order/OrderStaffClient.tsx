// components/_staffcomponent/_order/OrderStaffClient.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrderHeaderStaff from "@/components/_staffcomponent/_order/OrderHeaderStaff";
import OrderFilterDialogStaff from "@/components/_staffcomponent/_order/OrderFilterDialogStaff";
import OrderTableStaff from "@/components/_staffcomponent/_order/OrderTableStaff";
import OrderPaginationStaff from "@/components/_staffcomponent/_order/OrderPaginationStaff";
import EmptyState from "@/components/_loading/EmptyState";

import { Order, OrderFilterData } from "@/type/order";
import { getOrdersStaff } from "@/ultis/OrderAPI";

const OrderStaffClient: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [filters, setFilters] = useState<OrderFilterData>({
    orderStatus: "",
    orderStartDate: "",
    orderEndDate: "",
    shopManagerId: "",
    assignmentStartDate: "",
    staffId: "",
    assignmentEndDate: "",
  });

  // Load dữ liệu đơn hàng khi khởi tạo trang
  useEffect(() => {
    fetchData(filters, page, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (
    f: OrderFilterData,
    pg: number,
    skipLoading?: boolean
  ) => {
    if (!skipLoading) setLoading(true);
    setError("");

    try {
      const apiFilters: Record<string, any> = {};
      if (f.orderStatus) apiFilters.orderStatus = f.orderStatus;
      if (f.orderStartDate) apiFilters.orderStartDate = f.orderStartDate;
      if (f.orderEndDate) apiFilters.orderEndDate = f.orderEndDate;
      if (f.shopManagerId) apiFilters.shopManagerId = Number(f.shopManagerId);
      if (f.assignmentStartDate) apiFilters.assignmentStartDate = f.assignmentStartDate;
      if (f.staffId) apiFilters.staffId = Number(f.staffId);
      if (f.assignmentEndDate) apiFilters.assignmentEndDate = f.assignmentEndDate;

      const resp = await getOrdersStaff(pg, pageSize, apiFilters);
      // Với kiểu trả về: { data: Order[], totalRecords: number, page: number, pageSize: number }
      setOrders(resp.data);
      setTotalCount(resp.totalRecords);
    } catch (err: any) {
      setError(err.message || "Có lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (f: OrderFilterData) => {
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
    toast.success("Cập nhật đơn hàng thành công", { autoClose: 1000 });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Box sx={{ p: 4 }}>
        <OrderHeaderStaff
          onOpenFilter={() => setFilterDialogOpen(true)}
          onRefresh={refreshData}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : orders.length === 0 ? (
          <EmptyState loading={false} />
        ) : (
          <OrderTableStaff items={orders} onRefresh={refreshData} />
        )}
      </Box>

      <OrderFilterDialogStaff
        open={filterDialogOpen}
        initialFilters={filters}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleApplyFilters}
      />

      <OrderPaginationStaff
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ToastContainer />
    </>
  );
};

export default OrderStaffClient;
