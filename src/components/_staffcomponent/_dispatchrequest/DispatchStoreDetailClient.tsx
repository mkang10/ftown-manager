"use client"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  TableSortLabel,
  IconButton,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DispatchStoreDetail } from '@/type/dispatchnew';
import { getDispatchByStaff } from '@/ultis/dispatchapinew';
import { FullStockDetail } from '@/type/importStaff';
import { updateFullStockDispatch } from '@/ultis/dispatch';

// Styled components (Trắng-đen tinh tế)
const Container = styled(Box)({
  backgroundColor: '#fff',
  color: '#000',
  padding: '32px',
  minHeight: '100vh'
});
const CardPaper = styled(Paper)({
  backgroundColor: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  marginBottom: 24
});
const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
});
const FilterBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px'
});
const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    padding: '8px',
    borderRadius: 8,
    border: '1px solid #000',
    fontSize: '0.95rem'
  }
});

const ConfirmDialogTitle = styled(DialogTitle)({
  backgroundColor: '#000',
  color: '#fff',
  fontWeight: 'bold'
});
const ConfirmDialogContent = styled(DialogContent)({
  backgroundColor: '#fafafa',
  paddingTop: 24,
  paddingBottom: 24
});
const ConfirmDialogActions = styled(DialogActions)({
  padding: '16px 24px',
  backgroundColor: '#f0f0f0'
});
const CancelButton = styled(Button)({
  border: '1px solid #000',
  color: '#000',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#e0e0e0'
  }
});
const ConfirmButton = styled(Button)({
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333'
  }
});

const StaffDispatchPage: React.FC = () => {
  const [data, setData] = useState<DispatchStoreDetail[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dispatchStoreDetailId');
  const [isDescending, setIsDescending] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DispatchStoreDetail | null>(null);

  // Lấy staffId từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem('account');
    if (stored) {
      const account = JSON.parse(stored);
      setStaffId(account.roleDetails?.staffDetailId || 0);
    }
  }, []);

  const fetchData = useCallback(async (showLoading: boolean = true) => {
    if (!staffId) return;
    if (showLoading) setLoading(true);
    try {
      const params = {
        StaffDetailId: staffId,
        Status: statusFilter || undefined,
        SortBy: sortBy,
        IsDescending: isDescending,
        Page: page + 1,
        PageSize: pageSize
      };
      const resp = await getDispatchByStaff(params);
      setData(resp.data.data);
      setTotalRecords(resp.data.totalRecords);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [staffId, statusFilter, sortBy, isDescending, page, pageSize]);


  // Fetch data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (field: string) => {
    const desc = sortBy === field ? !isDescending : true;
    setSortBy(field);
    setIsDescending(desc);
    setPage(0);
  };

  const handleDoneClick = (row: DispatchStoreDetail) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };
  const router = useRouter();

  const handleConfirmDone = async () => {
    if (!selectedRow) return;
    const details: FullStockDetail[] = [{
      storeDetailId: selectedRow.dispatchStoreDetailId,
      actualReceivedQuantity: selectedRow.allocatedQuantity,
      comment: selectedRow.comments
    }];
    try {
      await updateFullStockDispatch(selectedRow.dispatchId, staffId, details);
      toast.success('Cập nhật xuất hàng thành công!');
      setOpenDialog(false);
      fetchData(false); // reload nhẹ không trigger loading spinner
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      toast.error('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} />

      <Header>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#000',
            borderLeft: '4px solid #000',
            paddingLeft: 2,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Danh sách phiếu xuất kho
        </Typography>
      </Header>

      <CardPaper>
        <FilterBox>
          <Typography>Trạng thái:</Typography>
          <StyledSelect
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as string); setPage(0); }}
            size="small"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Pending">Đang chờ</MenuItem>
            <MenuItem value="Processing">Đang xử lý</MenuItem>
            <MenuItem value="Completed">Hoàn thành</MenuItem>
            <MenuItem value="Cancelled">Đã huỷ</MenuItem>
          </StyledSelect>
        </FilterBox>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: '#000' }}>
                <TableRow>
                  {[

                    { id: 'dispatchStoreDetailId', label: 'Mã chi tiết' },
                    { id: 'warehouseName', label: 'Kho' },
                    { id: 'allocatedQuantity', label: 'SL phân bổ' },
                    { id: 'actualQuantity', label: 'SL thực tế' },

                    { id: 'status', label: 'Trạng thái' },
                    { id: 'comments', label: 'Ghi chú' },
                    { id: 'handleByName', label: 'Người Gán Đơn' },
                    { id: 'productName', label: 'Sản phẩm' },
                    { id: 'sizeName', label: 'Size' },
                    { id: 'colorName', label: 'Màu' },
                    { id: 'action', label: 'Thao tác' }
                  ].map(col => (
                    <TableCell key={col.id} sx={{ color: '#fff', fontWeight: 'bold', px: 2 }}>
                      {col.id !== 'action' ? (
                        <TableSortLabel
                          active={sortBy === col.id}
                          direction={isDescending ? 'desc' : 'asc'}
                          onClick={() => handleSort(col.id)}
                          sx={{ color: '#fff' }}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow
                    key={row.dispatchStoreDetailId}
                    hover
                    onClick={() => router.push(`/staff-dispatch-request/${row.dispatchStoreDetailId}`)}
                    sx={{
                      backgroundColor: idx % 2 ? '#fafafa' : '#fff',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <TableCell sx={{ px: 2 }}>{row.dispatchStoreDetailId}</TableCell>

                    <TableCell sx={{ px: 2 }}>{row.warehouseName}</TableCell>
                    <TableCell sx={{ px: 2 }}>{row.allocatedQuantity}</TableCell>
                    <TableCell sx={{ px: 2 }}>
                      {row.actualQuantity != null ? row.actualQuantity : '-'}
                    </TableCell>

                    <TableCell sx={{ px: 2 }}>{row.status.trim()}</TableCell>
                    <TableCell sx={{ px: 2 }}>{row.comments}</TableCell>
                    <TableCell sx={{ px: 2 }}>{row.handleByName}</TableCell>
                    <TableCell sx={{ px: 2 }}>{row.productName}</TableCell>
                    <TableCell sx={{ px: 2 }}>{row.sizeName}</TableCell>
                    <TableCell sx={{ px: 2 }}>{row.colorName}</TableCell>
                    <TableCell sx={{ px: 2 }}>
                      {row.status.trim() === 'Processing' && (
                      <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn redirect khi click nút
                        handleDoneClick(row);
                      }}
                    >
                      Hoàn thành
                    </Button>
                    
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_e, value) => setPage(value - 1)}
            shape="rounded"
          />
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Hiển thị:</Typography>
            <StyledSelect
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }}
              size="small"
              sx={{ width: 80 }}
            >
              {[5, 10, 25, 50].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </StyledSelect>
          </Box>
        </Box>
      </CardPaper>

      {/* Dialog confirm */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <ConfirmDialogTitle>Xác nhận hoàn thành</ConfirmDialogTitle>
        <ConfirmDialogContent>
          <DialogContentText sx={{ color: '#000' }}>
            Bạn có chắc chắn muốn xác nhận hoàn thành xuất hàng cho phiếu <strong>{selectedRow?.dispatchStoreDetailId}</strong> không?
          </DialogContentText>
        </ConfirmDialogContent>
        <ConfirmDialogActions>
          <CancelButton onClick={() => setOpenDialog(false)}>Huỷ</CancelButton>
          <ConfirmButton onClick={handleConfirmDone} variant="contained">Xác nhận</ConfirmButton>
        </ConfirmDialogActions>
      </Dialog>
    </Container>

  );
};

export default StaffDispatchPage;