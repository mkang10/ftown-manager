"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDispatchByStaff } from '@/ultis/dispatchapinew';
import { updateFullStockDispatch } from '@/ultis/dispatch';
import { DispatchStoreDetail } from '@/type/dispatchnew';
import { FullStockDetail } from '@/type/importStaff';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { FilterList as FilterListIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const predefinedStatuses = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

const StaffDispatchPage: React.FC = () => {
  const router = useRouter();
  const [rows, setRows] = useState<DispatchStoreDetail[]>([]);
  const [confirmRow, setConfirmRow] = useState<DispatchStoreDetail | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const accountStr = localStorage.getItem('account');
  const staffId = accountStr ? JSON.parse(accountStr).roleDetails?.staffDetailId : 0;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        StaffDetailId: staffId,
        Status: statusFilter !== 'All' ? statusFilter : undefined,
        Page: page,
        PageSize: pageSize,
      };
      const resp = await getDispatchByStaff(params);
      setRows(resp.data.data);
      setTotal(resp.data.totalRecords);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [staffId, statusFilter, page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleComplete = (row: DispatchStoreDetail) => setConfirmRow(row);
  const confirmDone = async () => {
    if (!confirmRow) return;
    try {
      await updateFullStockDispatch(confirmRow.dispatchId, staffId, [{
        storeDetailId: confirmRow.dispatchStoreDetailId,
        actualReceivedQuantity: confirmRow.allocatedQuantity,
        comment: confirmRow.comments,
      } as FullStockDetail]);
      toast.success('Cập nhật xuất hàng thành công!');
      fetchData();
    } catch {
      toast.error('Lỗi khi cập nhật!');
    }
    setConfirmRow(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: 'Inter', color: '#111' }}>
          Danh sách phiếu xuất kho
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setFiltersOpen(!filtersOpen)}>
            <FilterListIcon sx={{ color: '#111' }} />
          </IconButton>
          <IconButton onClick={() => fetchData()}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Box>

      {filtersOpen && (
        <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid #ccc' }}>
          <CardContent>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
                {predefinedStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={60} /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'black' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Mã chi tiết</TableCell>
                <TableCell sx={{ color: 'white' }}>Kho</TableCell>
                <TableCell sx={{ color: 'white' }}>SL phân bổ</TableCell>
                <TableCell sx={{ color: 'white' }}>SL thực tế</TableCell>
                <TableCell sx={{ color: 'white' }}>Trạng thái</TableCell>
                <TableCell sx={{ color: 'white' }}>Ghi chú</TableCell>
                <TableCell sx={{ color: 'white' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow
                  key={row.dispatchStoreDetailId}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/staff-dispatch-request/${row.dispatchStoreDetailId}`)}
                >
                  <TableCell>{row.dispatchStoreDetailId}</TableCell>
                  <TableCell>{row.warehouseName}</TableCell>
                  <TableCell>{row.allocatedQuantity}</TableCell>
                  <TableCell>{row.actualQuantity ?? '-'}</TableCell>
                  <TableCell>{row.status.trim()}</TableCell>
                  <TableCell>{row.comments}</TableCell>
                  <TableCell>
                    {row.status.trim() === 'Processing' ? (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#111',
                          color: '#fff',
                          borderRadius: 1,
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#333' }
                        }}
                        onClick={e => { e.stopPropagation(); handleComplete(row); }}
                      >
                        Hoàn thành
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">No Action</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(total / pageSize)}
          page={page}
          onChange={(_, v) => setPage(v)}
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog open={!!confirmRow} onClose={() => setConfirmRow(null)}>
        <DialogTitle>Xác nhận hoàn thành</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn hoàn thành xuất kho chi tiết <strong>{confirmRow?.dispatchStoreDetailId}</strong> không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRow(null)}>Không</Button>
          <Button variant="contained" onClick={confirmDone} sx={{ backgroundColor: '#111', borderRadius: 1 }}>Có</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffDispatchPage;
