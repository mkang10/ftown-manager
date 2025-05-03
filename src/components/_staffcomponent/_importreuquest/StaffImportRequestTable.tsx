import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Box,
  Chip,
  Tooltip,
  Button,
  useTheme,
} from "@mui/material";
import { TableSortLabel } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { StaffInventoryImportStoreDetailDto } from "@/type/importStaff";
import { updateFullStock, updateShortage } from "@/ultis/importapi";
import CommentDialog from "./CommentDialog";
import EmptyState from "@/components/_loading/EmptyState";

type ActionType = "FullStock" | "Shortage";

interface StaffImportRequestTableProps {
  items: StaffInventoryImportStoreDetailDto[];
  loading: boolean;
  onSortChange: (sortField: string, isDescending: boolean) => void;
  sortBy: string;
  isDescending: boolean;
  refreshData: () => void;
}

const statusColorMap: Record<string, string> = {
  success: "success",
  processing: "warning",
  failed: "error",
  shortage: "info",
};

export default function StaffImportRequestTable({
  items,
  loading,
  onSortChange,
  sortBy,
  isDescending,
  refreshData,
}: StaffImportRequestTableProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StaffInventoryImportStoreDetailDto | null>(null);
  const [actionType, setActionType] = useState<ActionType>("FullStock");
  const router = useRouter();
  const theme = useTheme();

  const startSort = (field: string) => () => {
    const desc = sortBy === field ? !isDescending : false;
    onSortChange(field, desc);
  };

  const openCommentDialog = (item: StaffInventoryImportStoreDetailDto, action: ActionType) => {
    setSelectedItem(item);
    setActionType(action);
    setOpenDialog(true);
  };

  const closeDialog = () => setOpenDialog(false);

  const handleCommentSubmit = async (comment: string, actualQty: number) => {
    if (!selectedItem) return;
    try {
      const account = typeof window !== 'undefined' && localStorage.getItem('account');
      const staffId = account ? JSON.parse(account).roleDetails?.staffDetailId || 0 : 0;
      const details = [{ storeDetailId: selectedItem.importStoreId, actualReceivedQuantity: actualQty, comment }];

      const result = actionType === 'FullStock'
        ? await updateFullStock(selectedItem.importId, staffId, details)
        : await updateShortage(selectedItem.importId, staffId, details);

      result.status
        ? toast.success(`Cập nhật thành công`)
        : toast.error(result.message || `Cập nhật thất bại`);

      refreshData();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Lỗi không xác định';
      toast.error(msg);
    } finally {
      closeDialog();
    }
  };

  if (!loading && items.length === 0) {
    return <EmptyState loading={false} />;
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 4,
          mt: 3,
          overflow: 'hidden',    // prevent shadow overflow
        }}
      >
        <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead sx={{ backgroundColor: '#000' }}>
            <TableRow >
              {[
                { label: 'Mã nhập kho', field: 'importStoreId' },
                { label: 'Sản phẩm', field: 'productName' },
                { label: 'Size', field: 'sizeName' },
                { label: 'Màu sắc', field: 'colorName' },
                { label: 'SL phân bổ', field: 'allocatedQuantity' },
                { label: 'SL thực tế', field: 'actualReceivedQuantity' },
                { label: 'Trạng thái', field: 'status' },
                { label: 'Ghi chú' },
                { label: 'Thao tác' },
              ].map(col => (
                <TableCell
                  key={col.label}
                  align="center"
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#fff', color: '#000'
                    }
                  }}
                >
                  {col.field ? (
                    <TableSortLabel
                      active={sortBy === col.field}
                      direction={sortBy === col.field && isDescending ? 'desc' : 'asc'}
                      onClick={startSort(col.field)}
                      sx={{
                        color: 'inherit',
                        '& .MuiTableSortLabel-icon': { color: 'inherit !important' }
                      }}
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
            {items.map(item => (
              <TableRow
                key={item.importStoreId}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/staff-import-requests/${item.importStoreId}`)}
              >
                <TableCell align="center">{item.importStoreId}</TableCell>
                <TableCell align="center">{item.productName}</TableCell>
                <TableCell align="center">{item.sizeName}</TableCell>
                <TableCell align="center">{item.colorName}</TableCell>
                <TableCell align="center">{item.allocatedQuantity}</TableCell>
                <TableCell align="center">{item.actualReceivedQuantity ?? '-'}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={item.status}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={item.comments || 'Không có ghi chú'}>
                    <Typography noWrap sx={{ maxWidth: 150 }}>{item.comments || '-'}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" onClick={e => e.stopPropagation()}>
                  {item.status.trim().toLowerCase() === 'processing' ? (
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => openCommentDialog(item, 'FullStock')}
                        sx={{
                          backgroundColor: '#111',
                          color: '#fff',
                          borderRadius: 1,
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#333' },
                        }}
                      >
                        Đủ hàng
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openCommentDialog(item, 'Shortage')}
                        sx={{
                          color: theme.palette.warning.main,
                          border: `1px solid ${theme.palette.warning.main}`,
                          textTransform: 'none',
                          '&:hover': { backgroundColor: theme.palette.warning.light },
                        }}
                      >
                        Thiếu hàng
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Không khả dụng</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CommentDialog
        open={openDialog}
        actionType={actionType}
        onClose={closeDialog}
        onSubmit={handleCommentSubmit}
      />
    </>
  );
}