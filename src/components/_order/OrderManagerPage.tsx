"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState, useCallback } from 'react';
import { getAssignmentManagerOrders } from '@/ultis/OrderAPI';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Pagination,
  Stack,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { AssignmentOrderFilters, AssignmentOrderResponse } from '@/type/order';
import OrderAssignDialog from './OrderAssignDialog';

interface RowProps {
  row: AssignmentOrderResponse;
  onAssigned: () => void;
}

const OrderRow: React.FC<RowProps> = ({ row, onAssigned }) => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAssignClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <>
      <TableRow
        hover
        sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.assignmentId}</TableCell>
        <TableCell>{row.order?.orderId}</TableCell>
        <TableCell>{row.order?.createdDate ? new Date(row.order.createdDate).toLocaleDateString() : ''}</TableCell>
        <TableCell>{row.order?.fullName}</TableCell>
        <TableCell>{row.order?.email}</TableCell>
        <TableCell>{row.order?.phoneNumber}</TableCell>
        <TableCell>{[
          row.order?.address,
          row.order?.district,
          row.order?.city,
        ].filter(Boolean).join(', ')}</TableCell>
        <TableCell>{row.assignmentDate ? new Date(row.assignmentDate).toLocaleDateString() : ''}</TableCell>
        <TableCell>{row.order?.status}</TableCell>
        <TableCell>{row.order?.orderTotal.toLocaleString()}</TableCell>
        <TableCell>{row.order?.shippingCost.toLocaleString()}</TableCell>
        <TableCell>
          {row.order?.status === 'Pending Confirmed' ? (
            <Button
              variant="contained"
              size="small"
              onClick={handleAssignClick}
              sx={{
                backgroundColor: '#111',
                color: '#fff',
                textTransform: 'none',
                borderRadius: 3,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              Giao việc
            </Button>

          ) : (
            <Typography variant="body2" color="text.secondary">
              No Action
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2} p={3} bgcolor="#fdfdfd" borderRadius={3} boxShadow={2}>
              <Typography variant="h6" gutterBottom fontWeight={600} color="black">
                Chi tiết sản phẩm
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0f4f8' }}>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Phiên bản</TableCell>
                    <TableCell>Kích cỡ</TableCell>
                    <TableCell>Màu sắc</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Giá mua</TableCell>
                    <TableCell>Giảm giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.order?.orderDetails.map((detail) => (
                    <TableRow key={detail.orderDetailId} hover>
                      <TableCell>{detail.productName}</TableCell>
                      <TableCell>{detail.variantName || '-'}</TableCell>
                      <TableCell>{detail.sizeName}</TableCell>
                      <TableCell>{detail.colorName}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{detail.priceAtPurchase.toLocaleString()} VND</TableCell>
                      <TableCell>{detail.discountApplied.toLocaleString()} VND</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <OrderAssignDialog
        open={dialogOpen}
        orderId={row.order?.orderId || 0}
        onClose={() => setDialogOpen(false)}
        onAssigned={onAssigned}
      />
    </>
  );
};

const predefinedRanges = [
  { label: '3 ngày qua', value: 3 },
  { label: '7 ngày qua', value: 7 },
  { label: '14 ngày qua', value: 14 },
  { label: '30 ngày qua', value: 30 },
];

const ManagerOrderPage: React.FC = () => {
  const accountStr = localStorage.getItem('account');
  if (!accountStr) throw new Error('Không tìm thấy thông tin tài khoản trong localStorage');
  const account = JSON.parse(accountStr);
  const shopManagerDetailId = account?.roleDetails?.shopManagerDetailId;
  if (!shopManagerDetailId) throw new Error('Không tìm thấy shopManagerDetailId trong account');

  const [filters, setFilters] = useState<AssignmentOrderFilters>({
    shopManagerId: shopManagerDetailId,
    page: 1,
    pageSize: 10,
  });
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [assignmentDateFrom, setAssignmentDateFrom] = useState<string>('');
  const [assignmentDateTo, setAssignmentDateTo] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [fullNameContains, setFullNameContains] = useState<string>('');
  const [rows, setRows] = useState<AssignmentOrderResponse[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuickRange = (days: number) => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);
    setAssignmentDateFrom(fromDate.toISOString().split('T')[0]);
    setAssignmentDateTo(toDate.toISOString().split('T')[0]);
  };
  const handleAssigned = () => {
    toast.success('Đã gán nhân viên xử lí đơn thành công');
    fetchData();
  };
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload: AssignmentOrderFilters = {
        ...filters,
        assignmentDateFrom: assignmentDateFrom || undefined,
        assignmentDateTo: assignmentDateTo || undefined,
        orderStatus: orderStatus || undefined,
        fullNameContains: fullNameContains || undefined,
      };
      const response = await getAssignmentManagerOrders(payload);
      setRows(response.data);
      setRowCount(response.totalRecords);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, assignmentDateFrom, assignmentDateTo, orderStatus, fullNameContains]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ p: 4 }}>
       <ToastContainer position="top-right" autoClose={3000} />
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#111', fontFamily: 'Inter' }}>
        Quản lý đơn hàng
      </Typography>


      <Card sx={{ mb: 3, borderRadius: 4, border: '1px solid #ccc', background: '#fff', boxShadow: 'none' }}>
        <CardHeader
          avatar={<IconButton onClick={() => setFilterOpen(!filterOpen)}><FilterListIcon sx={{ color: '#111' }} /></IconButton>}
          title={<Typography variant="subtitle1" sx={{ color: '#111', fontWeight: 500 }}>Bộ lọc nâng cao</Typography>}
        />
        <Collapse in={filterOpen} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Từ ngày" type="date" value={assignmentDateFrom} onChange={(e) => setAssignmentDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Đến ngày" type="date" value={assignmentDateTo} onChange={(e) => setAssignmentDateTo(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái đơn</InputLabel>
                  <Select value={orderStatus} label="Trạng thái đơn" onChange={(e) => setOrderStatus(e.target.value)}>
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label="Tên khách" placeholder="Nhập tên khách" value={fullNameContains} onChange={(e) => setFullNameContains(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#111',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                  onClick={() => setFilters((prev) => ({ ...prev, page: 1 }))}
                >
                  Tìm
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1}>
                  {predefinedRanges.map((range) => <Button
                    key={range.value}
                    variant="contained"
                    onClick={() => handleQuickRange(range.value)}
                    sx={{
                      backgroundColor: '#111',
                      color: '#fff',
                      textTransform: 'none',
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: '#333',
                      },
                    }}
                  >
                    {range.label}
                  </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>

      <Box sx={{ width: '100%', position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress size={60} thickness={5} />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 4 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'black', color: 'white' }}>

                  <TableRow>
                    <TableCell />
                    <TableCell sx={{ color: "white" }}>Mã phân công</TableCell>
                    <TableCell sx={{ color: "white" }}>Mã đơn</TableCell>
                    <TableCell sx={{ color: "white" }}>Ngày tạo</TableCell>
                    <TableCell sx={{ color: "white" }}>Khách hàng</TableCell>
                    <TableCell sx={{ color: "white" }}>Email</TableCell>
                    <TableCell sx={{ color: "white" }}>SĐT</TableCell>
                    <TableCell sx={{ color: "white" }}>Địa chỉ</TableCell>
                    <TableCell sx={{ color: "white" }}>Ngày giao</TableCell>
                    <TableCell sx={{ color: "white" }}>Trạng thái</TableCell>
                    <TableCell sx={{ color: "white" }}>Tổng tiền</TableCell>
                    <TableCell sx={{ color: "white" }}>Phí ship</TableCell>
                    <TableCell sx={{ color: "white" }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <OrderRow key={row.assignmentId} row={row} onAssigned={handleAssigned} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack spacing={2} mt={4} alignItems="center">
              <Pagination
                count={Math.ceil(rowCount / filters.pageSize!)}
                page={filters.page!}
                onChange={(e, newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
                color="standard"
                size="large"
                shape="rounded"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ManagerOrderPage;
