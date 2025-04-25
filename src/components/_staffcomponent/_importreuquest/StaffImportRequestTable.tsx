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
        ? toast.success(`${actionType} cập nhật thành công`)
        : toast.error(result.message || `${actionType} thất bại`);
      
      refreshData();
    } catch (error: any) {
      // Kiểm tra lỗi từ server (nếu có response trả về từ Axios)
      if (error.response && error.response.data) {
        const serverMessage = error.response.data.message || JSON.stringify(error.response.data);
        toast.error(`Lỗi từ server: ${serverMessage}`);
      } else if (error.message) {
        toast.error(`Lỗi: ${error.message}`);
      } else {
        toast.error('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      }
    } finally {
      closeDialog();
    }
  };
  

  if (!loading && items.length === 0) {
    return <EmptyState loading={false} />;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        mt: 3,
        backgroundColor: '#fff',
        border: '1px solid #111',  // Thêm viền đen cho bảng
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {[{ label: 'Mã nhập kho', field: 'importStoreId' },
                      

          
            { label: 'Sản phẩm', field: 'productName' },
            { label: 'Số lượng', field: 'sizeName' },
            { label: 'Màu sắc', field: 'colorName' },
              { label: 'Số lượng được phân bổ', field: 'allocatedQuantity' },
            { label: 'Số lượng được thực tế', field: 'actualReceivedQuantity' },
            { label: 'Trạng thái', field: 'status' },
            { label: 'Ghi chú' },
            { label: 'Thao tác' }].map((col) => (
              <TableCell
                key={col.label}
                align="center"
                sx={{ border: '1px solid #111' }} // Thêm viền đen cho từng ô
              >
                {col.field ? (
                  <TableSortLabel
                    active={sortBy === col.field}
                    direction={sortBy === col.field && isDescending ? 'desc' : 'asc'}
                    onClick={startSort(col.field)}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#111' }}>
                      {col.label}
                    </Typography>
                  </TableSortLabel>
                ) : (
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#111' }}>
                    {col.label}
                  </Typography>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {items.slice().map((item) => (
      <TableRow
        key={item.importStoreId}
        hover
        sx={{
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#fafafa',
          },
        }}
        onClick={() => router.push(`/staff-import-requests/${item.importStoreId}`)}
      >
              <TableCell align="center" sx={{ border: '1px solid #111' }}>{item.importStoreId}</TableCell>


              <TableCell align="center" sx={{ border: '1px solid #111' }}>{item.productName}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid #111' }}>{item.sizeName}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid #111' }}>{item.colorName}</TableCell>
              <TableCell align="center" sx={{ border: '1px solid #111' }}>{item.allocatedQuantity}</TableCell>

              <TableCell align="center" sx={{ border: '1px solid #111' }}>
   {item.actualReceivedQuantity != null ? item.actualReceivedQuantity : '-'}
</TableCell>
              <TableCell align="center" sx={{ border: '1px solid #111' }}>
                <Chip
                  label={item.status}
                  color={statusColorMap[item.status.trim().toLowerCase()] as any}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    borderRadius: '12px',
                    padding: '0 10px',
                  }}
                />
              </TableCell>
              <TableCell align="center" sx={{ border: '1px solid #111' }}>
                <Tooltip title={item.comments || 'Không có ghi chú'}>
                  <Typography noWrap sx={{ maxWidth: 150, color: '#333' }}>
                    {item.comments || '-'}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="center" onClick={(e) => e.stopPropagation()} sx={{ border: '1px solid #111' }}>
                {item.status.trim().toLowerCase() === 'processing' ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => openCommentDialog(item, 'FullStock')}
                      sx={{
                        backgroundColor: '#111',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#333',
                        },
                      }}
                    >
                      Đã đủ hàng
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => openCommentDialog(item, 'Shortage')}
                      sx={{
                        borderColor: '#f57c00',
                        color: '#f57c00',
                        '&:hover': {
                          backgroundColor: '#fff3e0',
                        },
                      }}
                    >
                      Thiếu hàng
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Không khả dụng
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CommentDialog
        open={openDialog}
        actionType={actionType}
        onClose={closeDialog}
        onSubmit={handleCommentSubmit}
      />
    </TableContainer>
  );
}
