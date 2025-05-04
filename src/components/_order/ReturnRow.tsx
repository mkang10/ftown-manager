import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Collapse,
  Box,
  Typography,
  Grid,
  Stack,
  IconButton,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { ReturnRequestItem } from "@/type/returnrequest";

interface ReturnRowProps {
    row: ReturnRequestItem;
  }
  
  const ReturnRow: React.FC<ReturnRowProps> = ({ row }) => {
    const [open, setOpen] = useState(false);
  
    return (
      <>
        <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
          <TableCell>
            <IconButton size="small" onClick={e => { e.stopPropagation(); setOpen(!open); }}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.returnOrderId}</TableCell>
          <TableCell>{row.orderId}</TableCell>
          <TableCell>{row.order.fullName}</TableCell>
          <TableCell>{new Date(row.createdDate).toLocaleString('vi-VN')}</TableCell>
          <TableCell>{row.status}</TableCell>
          <TableCell>{row.returnOption}</TableCell>
          <TableCell>{row.returnDescription}</TableCell>
          <TableCell>{row.totalRefundAmount.toLocaleString('vi-VN')} VND</TableCell>
        </TableRow>
  
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box m={2} p={2} bgcolor="#fff" borderRadius={2} boxShadow={1}>
                {/* Thông tin đổi trả */}
                <Typography variant="h6" fontWeight={600} mb={1}>Thông tin đổi trả</Typography>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography><strong>Lý do:</strong> {row.returnReason}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography><strong>Phương thức:</strong> {row.refundMethod}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography><strong>Mô tả:</strong> {row.returnDescription}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography><strong>Ngày tạo đơn:</strong> {new Date(row.createdDate).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography><strong>Hình ảnh:</strong></Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      {row.returnImages.map((url, i) => (
                        <Box
                          key={i}
                          component="img"
                          src={url}
                          alt={`img-${i}`}
                          sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
  
                {/* Chi tiết trả hàng */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Chi tiết sản phẩm</Typography>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f0f0f0' }}>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Màu</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Giá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.returnItems.map(item => (
                      <TableRow key={item.productVariantId} hover>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price.toLocaleString('vi-VN')} VND</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };
  
  export default ReturnRow;