"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Pagination,
} from "@mui/material";
import ReturnRow from "./ReturnRow";
import FilterCard from "./FilterCard";
import { GetReturnRequestsParams, ReturnRequestItem } from "@/type/returnrequest";
import { getReturnRequests } from "@/ultis/OrderAPI";

const ReturnRequestsPage: React.FC = () => {
  const [filters, setFilters] = useState<GetReturnRequestsParams>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [data, setData] = useState<ReturnRequestItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fetchData = useCallback(async (opts: { showSpinner: boolean }) => {
    if (opts.showSpinner) setLoading(true);
    else setRefreshing(true);

    try {
      const payload = { /* ... */ };
      const res = await getReturnRequests(payload);
      setData(res.data.items);
      setTotalCount(res.data.totalCount);
    } catch {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      if (opts.showSpinner) setLoading(false);
      else setRefreshing(false);
    }
  }, [/* deps */]);

  // 3) Lần đầu/mỗi filter gọi với showSpinner = true
  useEffect(() => {
    fetchData({ showSpinner: true });
  }, [fetchData]);



  const handleChange = (key: string, value: any) => {
    switch (key) {
      case "fromDate":
        setFromDate(value);
        break;
      case "toDate":
        setToDate(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "option":
        setOption(value);
        break;
      case "orderId":
        setOrderId(value);
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setFilters({ pageNumber: 1, pageSize: 10 });
    setFromDate(null);
    setToDate(null);
    setStatus("");
    setOption("");
    setOrderId("");
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Quản lý yêu cầu đổi trả
      </Typography>

      <FilterCard
        filters={filters}
        fromDate={fromDate}
        toDate={toDate}
        status={status}
        option={option}
        orderId={orderId}
        open={filterOpen}
        onToggle={() => setFilterOpen(!filterOpen)}
        onChange={handleChange}
        onReset={handleReset}
      />

{loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: "black" }}>
                <TableRow>
                  <TableCell sx={{ width: 50 }} />
                  <TableCell sx={{ color: "#fff" }}>Mã YC</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Mã Đơn</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Khách</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Ngày tạo</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Tuỳ chọn</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Mô tả</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Tổng tiền</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Hành động</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(item => (
                  <ReturnRow
                    key={item.returnOrder.returnOrderId}
                    row={item}
                    onUpdateSuccess={() => fetchData({ showSpinner: false })}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack spacing={2} mt={3} alignItems="center">
            <Pagination
              count={Math.ceil(totalCount / (filters.pageSize || 10))}
              page={filters.pageNumber!}
              onChange={(_, newPage) =>
                setFilters((prev) => ({ ...prev, pageNumber: newPage }))
              }
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ReturnRequestsPage;
