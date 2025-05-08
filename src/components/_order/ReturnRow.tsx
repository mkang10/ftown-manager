import React, { useState, useCallback } from "react";
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
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ReturnRequestItem } from "@/type/returnrequest";
import ReturnStatusButtons from "./ReturnStatusButtons";

interface ReturnRowProps {
  row: ReturnRequestItem;
  onUpdateSuccess?: () => void;
}

const ReturnRow: React.FC<ReturnRowProps> = ({ row, onUpdateSuccess }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openImage, setOpenImage] = useState<string | null>(null);

  const {
    returnOrder,
    returnOrderDetail,
    returnOrderItems,
  } = row;
  const {
    returnOrderId,
    orderId,
    accountName,
    status,
    returnOption,
    returnDescription,
    totalRefundAmount,
    createdDate,
  } = returnOrder;

  const {
    refundMethod,
    returnImages,
    bankName,
    bankAccountNumber,
    bankAccountName,
  } = returnOrderDetail;

  const formattedDateTime = new Date(createdDate).toLocaleString("vi-VN");
  const formattedDate = new Date(createdDate).toLocaleDateString("vi-VN");

  const handleImageClick = useCallback((url: string) => setOpenImage(url), []);
  const closeDialog = useCallback(() => setOpenImage(null), []);

  return (
    <>
      {/* Main row */}
      <TableRow hover sx={{ cursor: "pointer" }} onClick={() => setIsExpanded(prev => !prev)}>
        <TableCell>
          <IconButton size="small" onClick={e => { e.stopPropagation(); setIsExpanded(prev => !prev); }}>
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{returnOrderId}</TableCell>
        <TableCell>{orderId}</TableCell>
        <TableCell>{accountName}</TableCell>
        <TableCell>{formattedDateTime}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{returnOption}</TableCell>
        <TableCell>{returnDescription}</TableCell>
        <TableCell>{totalRefundAmount.toLocaleString("vi-VN")} VND</TableCell>
        <TableCell>
  {returnOrder.status === "Pending Processing" ? (
    <ReturnStatusButtons
      returnOrderId={returnOrder.returnOrderId}
      onSuccess={onUpdateSuccess}
    />
  ) : (
    <Typography
      variant="body2"
      sx={{
        color: (theme) => theme.palette.text.disabled, // xám mờ
        fontStyle: "italic",
      }}
    >
      No action
    </Typography>
  )}
</TableCell>

      </TableRow>

      {/* Expanded row */}
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, borderBottom: "none" }}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box m={2} p={2} bgcolor="background.paper" borderRadius={2} boxShadow={1}>
              {/* Return Information */}
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thông tin đổi trả
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Mô tả:</strong> {returnDescription}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Tên ngân hàng:</strong> {bankName}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Chủ thẻ:</strong> {bankAccountName}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Số thẻ:</strong> {bankAccountNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Phương thức:</strong> {refundMethod}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Ngày tạo:</strong> {formattedDate}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Hình ảnh hoàn trả:</strong></Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    {returnImages.map((url, idx) => (
                      <Box
                        key={idx}
                        component="img"
                        src={url}
                        alt={`return-img-${idx}`}
                        onClick={() => handleImageClick(url)}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 1,
                          cursor: "pointer",
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </Stack>
                </Grid>
              </Grid>

              {/* Product Detail Table */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Chi tiết sản phẩm trả lại
              </Typography>

              <Table size="small">
                <TableHead sx={{ bgcolor: "grey.100" }}>
                  <TableRow>
                    <TableCell>Ảnh SP</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Màu</TableCell>
                    <TableCell align="right">SL</TableCell>
                    <TableCell align="right">Giá mua</TableCell>
                    <TableCell align="right">Phí ship</TableCell>
                    <TableCell align="right">Giá trả</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {returnOrderItems.map(item => (
                    <TableRow key={item.productVariantName} hover>
                      <TableCell>
                        <Box
                          component="img"
                          src={item.imageUrl}
                          alt={item.productVariantName}
                          onClick={() => handleImageClick(item.imageUrl)}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 1,
                            cursor: "pointer",
                          }}
                        />
                      </TableCell>
                      <TableCell>{item.productVariantName}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block', width: 16, height: 16,
                            backgroundColor: item.color, borderRadius: '50%',
                            verticalAlign: 'middle', mr: 1,
                          }}
                        />
                        {item.color}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.priceAtPurchase.toLocaleString('vi-VN')}</TableCell>
                      <TableCell align="right">{item.shippingCost.toLocaleString('vi-VN')}</TableCell>
                      <TableCell align="right">{item.price.toLocaleString('vi-VN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Image Preview Dialog */}
      <Dialog
        open={Boolean(openImage)}
        onClose={closeDialog}
        maxWidth="lg"
        PaperProps={{ sx: { position: 'relative', p: 1 } }}
      >
        <IconButton
          onClick={closeDialog}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0 }}>
          {openImage && (
            <Box
              component="img"
              src={openImage}
              alt="Preview"
              sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReturnRow;
