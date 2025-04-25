"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { InventoryImportItem } from "@/type/InventoryImport";
import { useRouter } from "next/navigation";
import { getStatusColor } from "@/ultis/UI";

interface InventoryImportTableProps {
  items: InventoryImportItem[];
  sortBy: string;
  isDescending: boolean;
  onSortChange: (sortField: string, isDescending: boolean) => void;
}

const InventoryImportTable: React.FC<InventoryImportTableProps> = ({
  items,
  sortBy,
  isDescending,
  onSortChange,
}) => {
  const router = useRouter();

  const handleRowClick = (importId: number) => {
    router.push(`/inventory/import/${importId}`);
  };

  const createSortHandler = (field: string) => () => {
    const isActive = sortBy === field;
    const newIsDescending = isActive ? !isDescending : false;
    onSortChange(field, newIsDescending);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#fff' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'ImportId'}
                    direction={sortBy === 'ImportId' && isDescending ? 'desc' : 'asc'}
                    onClick={createSortHandler('ImportId')}
                  >
                    Mã nhập
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'ReferenceNumber'}
                    direction={sortBy === 'ReferenceNumber' && isDescending ? 'desc' : 'asc'}
                    onClick={createSortHandler('ReferenceNumber')}
                  >
                    Mã tham chiếu
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'CreatedByName'}
                    direction={sortBy === 'CreatedByName' && isDescending ? 'desc' : 'asc'}
                    onClick={createSortHandler('CreatedByName')}
                  >
                    Người tạo
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'CreatedDate'}
                    direction={sortBy === 'CreatedDate' && isDescending ? 'desc' : 'asc'}
                    onClick={createSortHandler('CreatedDate')}
                  >
                    Ngày tạo
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Trạng thái
                </TableCell>
                {/* <TableCell align="center" sx={{ fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === 'TotalCost'}
                    direction={sortBy === 'TotalCost' && isDescending ? 'desc' : 'asc'}
                    onClick={createSortHandler('TotalCost')}
                  >
                    Tổng chi phí
                  </TableSortLabel>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.importId}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#fafafa' },
                    transition: 'background-color 0.2s ease',
                  }}
                  onClick={() => handleRowClick(item.importId)}
                >
                  <TableCell align="center">
                    <Typography variant="body2" color="textPrimary">
                      {item.importId}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="textPrimary">
                      {item.referenceNumber}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="textPrimary">
                      {item.createdByName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="textPrimary">
                      {new Date(item.createdDate).toLocaleString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={
                      item.status === 'Partial Success' ? 'Phiếu nhập thiếu sản phẩm' : ''
                    }>
                      <Box
                        sx={{
                          backgroundColor: getStatusColor(item.status),
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: '8px',
                          px: 2,
                          py: 0.5,
                          display: 'inline-block',
                          fontSize: '0.875rem',
                        }}
                      >
                        {item.status}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  {/* <TableCell align="center">
                    <Typography variant="body2" color="textPrimary">
                      {item.totalCost.toLocaleString('vi-VN')} VND
                    </Typography>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InventoryImportTable;
