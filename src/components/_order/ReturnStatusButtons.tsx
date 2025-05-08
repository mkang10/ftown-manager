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
    async (newStatus: 'Approved' | 'Rejected') => {
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
          comment: newStatus === 'Rejected'
            ? 'Quản lý không chấp nhận trả hàng'
            : 'Quản lý đã chấp nhận trả hàng',
        };
        const result = await updateReturnRequestStatus(returnOrderId, payload);
        if (result.status) {
          toast.success('Cập nhật thành công!', { toastId: `return-${returnOrderId}` });
          onSuccess?.();
          // Tự động reload sau khi cập nhật
          setTimeout(() => {
            window.location.reload();
          }, 500);
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
    fontSize: '0.875rem',
    lineHeight: 1.5,
    px: 2,
    py: 1,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)' },
    '&:disabled': { opacity: 0.6 },
  };

  return (
    <Box display="flex" gap={1} alignItems="center">
      <Button
        variant="outlined"
        size="small"
        disabled={loading}
        onClick={e => { e.stopPropagation(); handleUpdate('Rejected'); }}
        sx={{
          ...buttonStyles,
          borderColor: '#FF5F5F',
          color: '#FF5F5F',
          '&:hover': { backgroundColor: 'rgba(255,95,95,0.1)' },
        }}
      >
        Không chấp nhận
      </Button>

      <Button
        variant="contained"
        size="small"
        disabled={loading}
        onClick={e => { e.stopPropagation(); handleUpdate('Approved'); }}
        sx={{
          ...buttonStyles,
          backgroundColor: '#4CAF50',
          color: '#fff',
          '&:hover': { backgroundColor: '#45A047' },
        }}
      >
        Chấp nhận
      </Button>
    </Box>
  );
};

export default ReturnStatusButtons;
