// components/_order/OrderClient.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrderHeader from "@/components/_order/OrderHeader";
import OrderFilterDialog from "@/components/_order/OrderFilterDialog";
import OrderTable from "@/components/_order/OrderTable";
import OrderPagination from "@/components/_order/OrderPagination";
import OrderAssignDialog from "@/components/_order/OrderAssignDialog";
import EmptyState from "@/components/_loading/EmptyState";

import { Order, OrderFilterData } from "@/type/order";
import { getOrdersManager } from "@/ultis/OrderAPI";

const OrderClient: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

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
      // Build các tham số filter theo định dạng backend cần
      const apiFilters: Record<string, any> = {};
      if (f.orderStatus) apiFilters.orderStatus = f.orderStatus;
      if (f.orderStartDate) apiFilters.orderStartDate = f.orderStartDate;
      if (f.orderEndDate) apiFilters.orderEndDate = f.orderEndDate;
      if (f.shopManagerId) apiFilters.shopManagerId = Number(f.shopManagerId);
      if (f.assignmentStartDate) apiFilters.assignmentStartDate = f.assignmentStartDate;
      if (f.staffId) apiFilters.staffId = Number(f.staffId);
      if (f.assignmentEndDate) apiFilters.assignmentEndDate = f.assignmentEndDate;
      
      const resp = await getOrdersManager(pg, pageSize, apiFilters);
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

  // Khi nhấn nút Assign trên mỗi đơn hàng trong bảng
  const handleOpenAssignDialog = (order: Order) => {
    setSelectedOrderId(order.orderId);
    setAssignDialogOpen(true);
  };

  // Sau khi gán xong
  const handleAssigned = () => {
    toast.success("Gán nhân viên cho đơn hàng thành công", { autoClose: 1000 });
    setAssignDialogOpen(false);
    setSelectedOrderId(null);
    refreshData();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Box sx={{ p: 4 }}>
        <OrderHeader
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
          <OrderTable
            items={orders}
            onRefresh={refreshData}
            onAssign={handleOpenAssignDialog}
          />
        )}
      </Box>

      <OrderFilterDialog
        open={filterDialogOpen}
        initialFilters={filters}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleApplyFilters}
      />

      <OrderPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedOrderId !== null && (
        <OrderAssignDialog
          open={assignDialogOpen}
          orderId={selectedOrderId}
          onClose={() => {
            setAssignDialogOpen(false);
            setSelectedOrderId(null);
          }}
          onAssigned={handleAssigned}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default OrderClient;
