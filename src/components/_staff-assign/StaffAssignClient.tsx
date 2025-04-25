"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  InputAdornment,
  MenuItem,
  TextField,
  Chip,
  Button,
  Select,
  Pagination,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { filterStaffInventoryImports } from '@/ultis/importassignapi';
import { InventoryImportRecord } from '@/type/importassign';
import StaffAssignDialog from './StaffAssignDialog';

interface InventoryImportRecordWithId extends InventoryImportRecord {
  importId: number;
}

const statusMap: Record<string, { label: string }> = {
  Processing: { label: 'Đang xử lý' },
  Success: { label: 'Hoàn tất' },
  Pending: { label: 'Chờ xử lý' },
  Shortage: { label: 'Thiếu hàng' },
  Handled: { label: 'Đã xử lý' }
};

const AssignButton = styled(Button)(() => ({
  textTransform: 'none',
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': { backgroundColor: '#333' }
}));

const StyledPaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  flexDirection: 'column'
}));

const StyledPaginationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  flexWrap: 'wrap',
  gap: theme.spacing(2)
}));

const StaffInventoryImportAssignPage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<InventoryImportRecordWithId[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImportId, setCurrentImportId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await filterStaffInventoryImports({
        Page: page + 1,
        PageSize: pageSize,
        Status: statusFilter
      });
      setData(resp.data.data as InventoryImportRecordWithId[]);
      setTotal(resp.data.totalRecords);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangePage = (_: any, value: number) => {
    setPage(value - 1);
  };

  const handleChangeRowsPerPage = (e: SelectChangeEvent<number>) => {
    const newSize = parseInt(e.target.value as string, 10);
    setPageSize(newSize);
    setPage(0);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setStatusFilter(e.target.value);
  };

  const handleRefresh = () => {
    setStatusFilter('');
    setPage(0);
  };

  const handleAssign = (importId: number) => {
    setCurrentImportId(importId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentImportId(null);
  };

  const handleAssigned = () => {
    fetchData();
  };

  const handleRowClick = (importId: number) => {
    router.push(`/assign/import/${importId}`);
  };

  return (
    <Box p={4} sx={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#212121', mb: 3, fontWeight: 600 }}>
        Danh sách phiếu nhập kho được phân công
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            select
            label="Trạng thái"
            value={statusFilter}
            onChange={handleStatusChange}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.entries(statusMap).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <IconButton onClick={handleRefresh} sx={{ color: '#757575' }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 3, position: 'relative' }}>
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.7)'
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {error ? (
          <Box p={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 800, opacity: loading ? 0.5 : 1 }}>
              <TableHead sx={{ backgroundColor: '#212121' }}>
                <TableRow>
                  {['Mã CT', 'Kho', 'Sản phẩm', 'Size', 'Màu', 'Thực nhận', 'Đã phân bổ', 'Trạng thái', 'Quản Lý', 'Ghi chú', 'Hành động'].map(
                    (h) => (
                      <TableCell key={h} sx={{ color: '#fff', fontWeight: 600, py: 1.5 }}>
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => {
                  const isPending = row.status?.trim() === 'Pending';
                  return (
                    <TableRow
                      key={row.importDetailId}
                      hover
                      onClick={() => handleRowClick(row.importId)}
                      sx={{ cursor: 'pointer', backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}
                    >
                      <TableCell>{row.importDetailId}</TableCell>
                      <TableCell>{row.warehouseName}</TableCell>
                      <TableCell>{row.productName}</TableCell>
                      <TableCell>{row.sizeName}</TableCell>
                      <TableCell>{row.colorName}</TableCell>
                      <TableCell>
                        {row.actualReceivedQuantity != null ? row.actualReceivedQuantity : '-'}
                      </TableCell>
                      <TableCell>{row.allocatedQuantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusMap[row.status]?.label || row.status}
                          variant="outlined"
                          sx={{ borderColor: '#212121', color: '#212121', fontWeight: 500, px: 1 }}
                        />
                      </TableCell>
                      <TableCell>{row.handleByName}</TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap title={row.comments || ''}>
                          {row.comments?.trim() ? row.comments : '-'}
                        </Typography>

                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        {isPending ? (
                          <AssignButton size="small" onClick={() => handleAssign(row.importId)}>
                            Gán
                          </AssignButton>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#757575' }}>
                            No action
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <StyledPaginationContainer>
          <StyledPaginationWrapper>
            <FormControl size="small">
              <InputLabel id="page-size-select-label">Số dòng</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={pageSize}
                onChange={handleChangeRowsPerPage}
                label="Số dòng"
              >
                {[5, 10, 20, 50].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Pagination
              count={Math.ceil(total / pageSize)}
              page={page + 1}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              variant="outlined"
              showFirstButton
              showLastButton
            />
          </StyledPaginationWrapper>
        </StyledPaginationContainer>
      </Paper>

      {currentImportId !== null && (
        <StaffAssignDialog
          open={dialogOpen}
          importId={currentImportId}
          onClose={handleDialogClose}
          onAssigned={() => {
            handleDialogClose();
            handleAssigned();
          }}
        />
      )}
    </Box>
  );
};

export default StaffInventoryImportAssignPage;
