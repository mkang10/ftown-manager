'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, styled, Button, Box ,Typography} from '@mui/material';
import { InventoryImportItem } from '@/type/InventoryImport';

// Mapping trạng thái sang màu và nhãn tiếng Việt
const STATUS_COLOR: Record<string, string> = {
  pending: 'grey.500',
  Approved: 'success.main',
  rejected: 'error.main',
  Processing: '#ffee33',
  done: '#00695c',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'pending',
  Approved: 'Approved',
  rejected: 'rejected',
  Processing: 'Đang xử lý',
  done: 'done',
};

interface StaffAssignTableProps {
  items: InventoryImportItem[];
  onAssign: (importId: number) => void;
}

const TableContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #000',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  overflowX: 'auto',
}));

const HeaderCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
  borderBottom: '2px solid #000',
}));

const BodyRow = styled(TableRow)(() => ({
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: '#f9f9f9',
  },
}));

const AssignButton = styled(Button)(() => ({
  textTransform: 'none',
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
}));

const StaffAssignTable: React.FC<StaffAssignTableProps> = ({ items, onAssign }) => {
  const router = useRouter();

  const handleRowClick = (importId: number) => {
    router.push(`/assign/import/${importId}`);
  };

  return (
    <TableContainer>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell align="center">Mã phiếu</HeaderCell>
              <HeaderCell>Người tạo</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Ngày tạo</HeaderCell>
              <HeaderCell>Trạng thái</HeaderCell>
              <HeaderCell>Số tham chiếu</HeaderCell>
              {/* <HeaderCell align="right">Tổng chi phí</HeaderCell> */}
              <HeaderCell>Ngày duyệt</HeaderCell>
              <HeaderCell>Ngày hoàn thành</HeaderCell>
              <HeaderCell align="center">Thao tác</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <BodyRow key={item.importId} onClick={() => handleRowClick(item.importId)}>
                <TableCell align="center">{item.importId}</TableCell>
                <TableCell>{item.createdByName}</TableCell>
                <TableCell>{item.email || '-'}</TableCell>
                <TableCell>{new Date(item.createdDate).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: STATUS_COLOR[item.status] || 'grey.500', fontWeight: 'bold' }}>
                  {STATUS_LABEL[item.status] || item.status}
                </TableCell>
                <TableCell>{item.referenceNumber}</TableCell>
                {/* <TableCell align="right">{item.totalCost.toLocaleString('vi-VN')} VND</TableCell> */}
                <TableCell>
                  {item.approvedDate
                    ? new Date(item.approvedDate).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {item.completedDate
                    ? new Date(item.completedDate).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                {(item.status === 'Partial Success' || item.status === 'Approved') ? (
  <AssignButton 
    variant="contained" 
    size="small" 
    onClick={() => onAssign(item.importId)}
  >
    Gán
  </AssignButton>
) : (
  <Typography 
    variant="body2" 
    component="span" 
    sx={{ color: 'text.disabled', fontStyle: 'italic' }}
  >
    No action
  </Typography>
)}

                </TableCell>
              </BodyRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  );
};

export default StaffAssignTable;
