// app/staff-assign/[importId]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  Grid,
  Tabs,
  Tab,
  Paper,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Chip,
} from '@mui/material';

// Đảm bảo import đúng file api client
// Đảm bảo import đúng type
import DashboardLayout from '@/layout/DasboardLayout';
import { ImportResponseDto } from '@/type/importdetailsm';
import { getImportById } from '@/ultis/importapi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const ImportDetailPage: React.FC = () => {
  const params = useParams();
  // support both dynamic segment names: [importId] or [id]
  const rawId = (params as any).importId ?? (params as any).id;
  const importId = rawId ? Number(rawId) : null;
  const [data, setData] = useState<ImportResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!importId || isNaN(importId)) {
      setError('Import ID không hợp lệ');
      setLoading(false);
      return;
    }
    getImportById(importId)
      .then(res => setData(res))
      .catch(err => setError(err.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [importId]);

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
    );
  }
  if (error) {
    return (
        <Typography color="error" align="center" mt={10}>{error}</Typography>
    );
  }
  if (!data) {
    return (
        <Typography align="center" mt={10}>Không tìm thấy dữ liệu Import.</Typography>
    );
  }

  const { referenceNumber, createdDate, status, totalCost, createdByName, approvedDate, completedDate, details, auditLogs } = data;

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Chi tiết Import #{referenceNumber}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Paper sx={{ borderRadius: 2, boxShadow: 3, mb: 3 }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered>
            <Tab label="Tổng Quát" />
            <Tab label="Chi Tiết" />
            <Tab label="Lịch sử thay đổi" />
          </Tabs>
        </Paper>

        <TabPanel value={tabIndex} index={0}>
          <Card sx={{ p: 3, mb: 4, boxShadow: 1 }}>
            <Grid container spacing={3}>
              {[
                ['Đơn Nhập Hàng', importId],
                ['Mã Tham Chiếu.', referenceNumber],
                ['Ngày Tạo', new Date(createdDate).toLocaleString()],
                ['Trạng Thái', <Chip key="status" label={status} color={status === 'Approved' ? 'success' : 'default'} size="small" />],
                // ['Tổng Tiền Nhập', totalCost.toLocaleString()],
                ['Người Tạo Đơn', createdByName],
                ['Ngày Phê Duyệt', approvedDate || '-'],
                ['Ngày Hoàn Thành', completedDate || '-'],
              ].map(([label, val]) => (
                <Grid item xs={12} sm={6} md={4} key={String(label)}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {label}
                  </Typography>
                  <Box mt={1}>
                    {typeof val === 'string' || typeof val === 'number' ? (
                      <Typography variant="body1">{val}</Typography>
                    ) : (
                      val
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Typography variant="h6" gutterBottom>
            Đơn Nhập Hàng Chi Tiết
          </Typography>
          {details.map(detail => (
            <Card key={detail.importDetailId} sx={{ mb: 3, p: 2, boxShadow: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {detail.productVariantName} (ID: {detail.importDetailId})
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Số Lượng Tổng
                  </Typography>
                  <Typography variant="body1">{detail.quantity}</Typography>
                </Grid>
              </Grid>

              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Cửa Hàng</TableCell>
                    <TableCell align="right">SL Dự kiến</TableCell>
                    <TableCell align="right">SL Thực Tế</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Ghi Chú</TableCell>
                    <TableCell>Nhân Viên Xử Lí</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detail.storeDetails.map(store => (
                    <TableRow key={`${detail.importDetailId}-${store.storeId}`} hover>
                      <TableCell>{store.storeName}</TableCell>
                      <TableCell align="right">{store.allocatedQuantity}</TableCell>
                      <TableCell align="right">{store.actualQuantity ?? 0}</TableCell>
                      <TableCell>
                        <Chip label={store.status.trim()} size="small" />
                      </TableCell>
                      <TableCell>{store.comments || '-'}</TableCell>
                      <TableCell>{store.staffName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ))}
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <Typography variant="h6" gutterBottom>
            Lịch Sử Đơn Nhập Hàng
          </Typography>
          {auditLogs.length === 0 ? (
            <Typography>Không có log.</Typography>
          ) : (
            auditLogs.map(log => (
              <Card key={log.auditLogId} sx={{ mb: 2, p: 2, boxShadow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {log.operation} bởi {log.changedBy} lúc {new Date(log.changeDate).toLocaleString()}
                </Typography>
                {log.comment && <Typography variant="body2" mt={1}>{log.comment}</Typography>}
              </Card>
            ))
          )}
        </TabPanel>
      </Box>
    </>
  );
};

export default ImportDetailPage;
