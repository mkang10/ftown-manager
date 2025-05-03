"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Tabs,
  Tab,
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
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getImportStoreDetailById } from "@/ultis/importstoredetail";
import { AuditLog, ImportStoreDetail } from "@/type/importstore";

const ImportStoreDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [detail, setDetail] = useState<ImportStoreDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<'logs'>('logs');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getImportStoreDetailById(Number(id))
      .then(res => setDetail(res.data))
      .catch(() => setError("Không thể tải dữ liệu chi tiết nhập kho."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, value: 'logs') => {
    setTabValue(value);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();
  const statusColor = (status: string) => {
    const s = status.trim().toLowerCase();
    if (s === "success" || s === "approved") return "success";
    if (s === "pending") return "warning";
    if (s === "error" || s === "failed") return "error";
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
        <Typography color="error" variant="h6">{error}</Typography>
        <Button variant="outlined" onClick={() => router.back()} sx={{ mt: 2 }}>Thử lại</Button>
      </Box>
    );
  }

  if (!detail) {
    return (
      <Box m={4} textAlign="center">
        <Typography>Không có dữ liệu để hiển thị.</Typography>
        <Button variant="outlined" onClick={() => router.back()} sx={{ mt: 2 }}>Quay lại</Button>
      </Box>
    );
  }

  return (
    <Box p={4} maxWidth="1200px" margin="0 auto">
      <Box display="flex" alignItems="center" mb={3} gap={1}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Nhập kho #{detail.referenceNumber}
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardHeader title="Thông tin chung" sx={{ backgroundColor: '#f5f5f5', pb: 1 }} />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Kho</Typography>
              <Typography>{detail.warehouseName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Trạng thái</Typography>
              <Chip label={detail.status.trim()} color={statusColor(detail.status)} size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Nhân viên</Typography>
              <Typography>{detail.staff}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Sản phẩm</Typography>
              <Typography>{detail.productName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Màu</Typography>
              <Typography>{detail.colorName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Size</Typography>
              <Typography>{detail.sizeName}</Typography>
            </Grid>
           
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold">Ghi chú</Typography>
              <Typography>{detail.comments}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Đã nhận</Typography>
              <Typography>{detail.actualReceivedQuantity}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Phân bổ</Typography>
              <Typography>{detail.allocatedQuantity}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" fontWeight="bold">Giá vốn</Typography>
              <Typography>{detail.costPrice ?? '-'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper elevation={1}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Lịch sử thao tác" value="logs" />
        </Tabs>
      </Paper>

      {tabValue === 'logs' && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Thao tác</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Người thực hiện</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail.auditLogs.map((log: AuditLog) => (
                <TableRow key={log.auditLogId} hover>
                  <TableCell>{log.operation}</TableCell>
                  <TableCell>{formatDate(log.changeDate)}</TableCell>
                  <TableCell>{log.changedByName}</TableCell>
                  <TableCell>{log.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ImportStoreDetailPage;