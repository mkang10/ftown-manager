"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  IconButton,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { AuditLog, DispatchStoreDetail } from "@/type/storeexportresponse";
import { getDispatchStoreDetailById } from "@/ultis/storeexport";

const DispatchStoreExportDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id;
  const [detail, setDetail] = useState<DispatchStoreDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(idParam);
    if (!idParam || isNaN(id)) {
      setError("ID không hợp lệ");
      return;
    }
    setLoading(true);
    getDispatchStoreDetailById(id)
      .then((res) => {
        // Dữ liệu trả về có thể là array hoặc object, định dạng lại với any để tránh conflict type
        const rawData: any = res.data;
        const item = Array.isArray(rawData) ? rawData[0] : rawData;
        if (!item) {
          setError("Không có dữ liệu");
          return;
        }
        // Tạo đối tượng đúng kiểu DispatchStoreDetail
        const detailObj: DispatchStoreDetail = {
          warehouseName: item.warehouseName,
          allocatedQuantity: item.allocatedQuantity,
          status: item.status,
          colorName : item.colorName,
          sizeName: item.sizeName,
          productName: item.productName,
          comments: item.comments ?? "",
          staff: item.staff ?? null,
          dispatchDetailId: item.dispatchDetailId,
          handleBy: item.handleBy,
          dispatchStoreDetailId: item.dispatchStoreDetailId,
          actualQuantity: item.actualQuantity ?? null,
          referenceNumber: item.referenceNumber,
          auditLogs: Array.isArray(item.auditLogs) ? item.auditLogs : [],
        };
        setDetail(detailObj);
      })
      .catch(() => setError("Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [idParam]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColor = (status: string) => {
    const s = status.trim().toLowerCase();
    if (["success", "approved"].includes(s)) return "success";
    if (s === "pending") return "warning";
    if (["error", "failed"].includes(s)) return "error";
    return "default";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4} textAlign="center">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          sx={{ mt: 2, textTransform: "none" }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  if (!detail) {
    return (
      <Box m={4} textAlign="center">
        <Typography>Không có dữ liệu để hiển thị.</Typography>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          sx={{ mt: 2, textTransform: "none" }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4} maxWidth={1000} mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3} gap={1}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Xuất kho #{detail.referenceNumber}
        </Typography>
      </Box>

      {/* Thông tin chung */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardHeader
          title="Thông tin chung"
          sx={{
            backgroundColor: "#fafafa",
            '& .MuiCardHeader-title': { fontWeight: 600, fontSize: '1.1rem' },
          }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {[
              { label: 'Kho', content: detail.warehouseName },
              { label: 'Quản lý', content: detail.handleBy },
              { label: 'Nhân viên', content: detail.staff || '-' },
              { label: 'Sản phẩm', content: detail.productName || '-' },
              { label: 'Kích thước', content: detail.sizeName || '-' },
              { label: 'Màu sắc', content: detail.colorName || '-' },
              { label: 'Đã phân bổ', content: detail.allocatedQuantity },
              { label: 'Thực xuất', content: detail.actualQuantity ?? '-' },
              { label: 'Trạng thái', content: <Chip label={detail.status} color={statusColor(detail.status)} size="small" /> },

            ].map((item, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="body1">{item.content}</Typography>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Ghi chú
              </Typography>
              <Typography variant="body1">{detail.comments || '-'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lịch sử thao tác */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Lịch sử thao tác
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2, mt: 2 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Người thực hiện</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detail.auditLogs.length > 0 ? (
              detail.auditLogs.map((log: AuditLog) => (
                <TableRow key={log.auditLogId} hover>
                  <TableCell>{log.operation}</TableCell>
                  <TableCell>{formatDate(log.changeDate)}</TableCell>
                  <TableCell>{log.changedByName}</TableCell>
                  <TableCell>{log.comment || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có lịch sử
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DispatchStoreExportDetailPage;
