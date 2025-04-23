"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
  Chip,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getAssignmentOrderById } from '@/ultis/OrderAPI';
import { AssignmentOrderResponse, OrderDetail } from '@/type/orderdetail';

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [data, setData] = useState<AssignmentOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getAssignmentOrderById(id)
      .then(res => setData(res))
      .catch(() => setError('Không thể tải thông tin order.'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
      <CircularProgress />
    </Box>
  );
  if (error) return (
    <Box p={4} textAlign="center">
      <Typography color="error">{error}</Typography>
      <Typography variant="body2" onClick={() => router.back()} sx={{ mt: 2, cursor: 'pointer' }}>Quay lại</Typography>
    </Box>
  );
  if (!data) return null;

  const { assignmentId, assignmentDate, comments, order } = data;

  return (
    <Box p={4} maxWidth="1000px" mx="auto">
      <Box display="flex" alignItems="center" mb={2}>
        <ArrowBackIosNewIcon onClick={() => router.back()} sx={{ cursor: 'pointer', mr: 1 }} />
        <Typography variant="h5" fontWeight="bold">Assignment #{assignmentId}</Typography>
      </Box>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader title="Thông tin Assignment" sx={{ backgroundColor: '#f5f5f5' }} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Ngày Assignment</Typography>
              <Typography>{formatDate(assignmentDate)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Ghi chú</Typography>
              <Typography>{comments || '-'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader title="Thông tin Order" sx={{ backgroundColor: '#f5f5f5' }} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Order ID</Typography>
              <Typography>{order.orderId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Ngày tạo</Typography>
              <Typography>{formatDate(order.createdDate)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Trạng thái</Typography>
              <Chip label={order.status} size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Khách hàng</Typography>
              <Typography>{order.fullName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography>{order.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography>{order.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2">Địa chỉ</Typography>
              <Typography>{order.address}, {order.city}, {order.district}, {order.country}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Tổng đơn hàng</Typography>
              <Typography>{order.orderTotal}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2">Phí ship</Typography>
              <Typography>{order.shippingCost}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" mb={2}>Chi tiết sản phẩm</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID Chi tiết</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Màu</TableCell>
              <TableCell align="right">SL mua</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="right">Giảm giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderDetails.map((item: OrderDetail) => (
              <TableRow key={item.orderDetailId}>
                <TableCell>{item.orderDetailId}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.sizeName}</TableCell>
                <TableCell>{item.colorName}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.priceAtPurchase}</TableCell>
                <TableCell align="right">{item.discountApplied}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderDetailPage;
