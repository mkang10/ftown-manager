import React, { useState, useCallback, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { updateReturnRequestStatus } from '@/ultis/OrderAPI';
import { toast } from 'react-toastify';

interface Props {
  returnOrderId: number;
  onSuccess?: () => void;
}

const ReturnStatusButtons: React.FC<Props> = ({ returnOrderId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [changedBy, setChangedBy] = useState<number | null>(null);

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem('account');
    if (stored) {
      try {
        const account = JSON.parse(stored);
        const managerId = account.roleDetails?.shopManagerDetailId;
        if (managerId) setChangedBy(managerId);
      } catch {
        console.warn('Invalid account in localStorage');
      }
    }
  }, []);

  const handleUpdate = useCallback(
    async (newStatus: 'Canceled' | 'Completed') => {
      if (!changedBy) {
        toast.error('Không tìm thấy người thực hiện hành động.');
        return;
      }
      if (loading) return;

      setLoading(true);
      try {
        const payload = {
          newStatus,
          changedBy,
          comment: newStatus === 'Canceled'
            ? 'Quản lý không chấp nhận trả hàng'
            : 'Quản lý đã chấp nhận trả hàng',
        };
        const result = await updateReturnRequestStatus(returnOrderId, payload);
        if (result.status) {
          toast.success('Cập nhật thành công!', { toastId: `return-${returnOrderId}` });
          onSuccess?.();
        } else {
          toast.error(result.message || 'Cập nhật thất bại');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    },
    [changedBy, loading, onSuccess, returnOrderId]
  );

  const buttonStyles = {
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    px: 3,
    py: 1,
    boxShadow: 'none',
    '&:hover': { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
    '&:disabled': { opacity: 0.6 },
  };

  return (
    <Box display="flex" gap={1}>
      <Button
        variant="outlined"
        disabled={loading}
        onClick={e => { e.stopPropagation(); handleUpdate('Canceled'); }}
        sx={{
          ...buttonStyles,
          borderColor: '#000',
          color: '#000',
        }}
      >
        Không chấp nhận
      </Button>

      <Button
        variant="contained"
        disabled={loading}
        onClick={e => { e.stopPropagation(); handleUpdate('Completed'); }}
        sx={{
          ...buttonStyles,
          backgroundColor: '#000',
          color: '#fff',
          '&:hover': { backgroundColor: '#333', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
        }}
      >
        Chấp nhận
      </Button>
    </Box>
  );
};

export default ReturnStatusButtons;
