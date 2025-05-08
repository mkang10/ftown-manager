"use client";
import React, { useState } from "react";
import { Box, Typography, Button, Collapse, Grid, Alert } from "@mui/material";
import { ImportDetailItem, AuditLog } from "@/type/importdetail";

// Component xử lý hiển thị một mảng với nút collapse riêng
interface CollapsibleArrayProps {
  data: any[];
}
const CollapsibleArray: React.FC<CollapsibleArrayProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box sx={{ ml: 2 }}>
      <Button
        variant="outlined"
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          color: "#333",
          borderColor: "#333",
          "&:hover": {
            borderColor: "#777",
            backgroundColor: "#fafafa", // Màu nền nhạt khi hover
          },
          borderRadius: "50px", // Bo tròn nút đẹp hơn
          padding: "8px 20px",
          textTransform: "none",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ nhẹ
          transition: "all 0.3s ease",
        }}
      >
        {open ? "Ẩn Các Mục" : "Hiển Thị Các Mục"}
      </Button>
      <Collapse in={open}>
        {data.map((item, index) => (
          <Box key={index} sx={{ ml: 2, mt: 1 }}>
            <RenderValue value={item} />
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

// Component đệ quy để render một giá trị (primitive, object, hoặc mảng)
interface RenderValueProps {
  value: any;
}
const RenderValue: React.FC<RenderValueProps> = ({ value }) => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value !== "object") {
    return <Typography variant="body2" sx={{ color: "#333" }}>{String(value)}</Typography>;
  }

  // Nếu là mảng
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return <CollapsibleArray data={value} />;
  }

  // Nếu là object
  const entries = Object.entries(value).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (entries.length === 0) return null;
  return (
    <Box sx={{ ml: 2 }}>
      {entries.map(([key, val]) => (
        <Box key={key} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ color: "#333" }}>
            <strong>{key}:</strong>{" "}
            {typeof val === "object" ? <RenderValue value={val} /> : String(val)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

interface ImportDetailDetailsProps {
  details: ImportDetailItem[];
  auditLogs: AuditLog[];
}

const ImportDetailDetails: React.FC<ImportDetailDetailsProps> = ({ details, auditLogs }) => {
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [openAudit, setOpenAudit] = useState<boolean>(false);

  const handleToggleDetails = () => setOpenDetails((prev) => !prev);
  const handleToggleAudit = () => setOpenAudit((prev) => !prev);

  // Hàm renderChangeData sử dụng RenderValue để xử lý đệ quy
  const renderChangeData = (changeData: string): React.ReactNode => {
    if (!changeData) return null;
    try {
      const parsed = JSON.parse(changeData);
      return <RenderValue value={parsed} />;
    } catch (error) {
      return <Typography variant="body2" sx={{ color: "#333" }}>{changeData}</Typography>;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Import Details */}
      <Button
        variant="outlined"
        onClick={handleToggleDetails}
        sx={{
          mb: 1,
          color: "#333",
          borderColor: "#333",
          "&:hover": {
            borderColor: "#777",
            backgroundColor: "#fafafa", // Màu nền nhạt khi hover
          },
          borderRadius: "50px",
          padding: "8px 20px",
          textTransform: "none",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ nhẹ
          transition: "all 0.3s ease",
        }}
      >
        {openDetails ? "Ẩn Chi Tiết Nhập Kho" : "Hiển Thị Chi Tiết Nhập Kho"}
      </Button>
      <Collapse in={openDetails}>
        {details.map((detail) => (
          <Box
            key={detail.importDetailId}
            sx={{
              ml: 2,
              mt: 1,
              borderBottom: "1px solid #ddd",
              pb: 1,
              mb: 1,
              backgroundColor: "#f9f9f9", // Nền sáng nhẹ cho mỗi mục
              borderRadius: "8px", // Bo tròn góc cho đẹp hơn
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ nhẹ
              transition: "all 0.3s ease",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              <strong>Mã Sản Phẩm:</strong> {detail.productVariantId}
            </Typography>
            <Typography variant="body1">
              <strong>Số Lượng:</strong> {detail.quantity}
            </Typography>
            <Typography variant="body1">
              <strong>Tên Sản Phẩm:</strong> {detail.productVariantName || "-"}
            </Typography>
            <Box sx={{ ml: 2, mt: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <strong>Phân Bổ Kho:</strong>
              </Typography>
              {detail.storeDetails.map((store) => {
                const missing = store.allocatedQuantity - store.actualQuantity;
                return (
                  <Box key={store.storeId} sx={{ ml: 2, mt: 0.5 }}>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      <strong>Kho ID:</strong> {store.storeId} - <strong>Tên Kho:</strong> {store.storeName} -{" "}
                      <strong>Phân Bổ:</strong> {store.allocatedQuantity} - <strong>Thực Tế:</strong>{" "}
                      {store.actualQuantity} - <strong>Nhân Viên:</strong> {store.staffName} -{" "}
                      <strong>Trạng Thái:</strong> {store.status.trim()}
                    </Typography>
                    {missing > 0 && store.status.trim() === "Shortage" && (
                      <Alert severity="error" sx={{ mt: 1, borderRadius: "8px" }}>
                        Thiếu {missing} mặt hàng{missing > 1 ? "" : ""}
                      </Alert>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Collapse>

      {/* Audit Logs */}
      <Button
        variant="outlined"
        onClick={handleToggleAudit}
        sx={{
          mt: 2,
          mb: 1,
          color: "#333",
          borderColor: "#333",
          "&:hover": {
            borderColor: "#777",
            backgroundColor: "#fafafa", // Màu nền nhạt khi hover
          },
          borderRadius: "50px",
          padding: "8px 20px",
          textTransform: "none",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {openAudit ? "Ẩn Nhật Ký Kiểm Tra" : "Hiển Thị Nhật Ký Kiểm Tra"}
      </Button>
      <Collapse in={openAudit}>
        {auditLogs.map((log) => (
          <Box
            key={log.auditLogId}
            sx={{
              ml: 2,
              mt: 1,
              borderBottom: "1px solid #ddd",
              pb: 1,
              mb: 1,
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>ID Kiểm Tra:</strong> {log.auditLogId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Bảng:</strong> {log.tableName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Thao Tác:</strong> {log.operation}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Thay Đổi Bởi:</strong> {log.changedByName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Ngày Thay Đổi:</strong> {log.changeDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Bình Luận:</strong> {log.comment}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Dữ Liệu Thay Đổi:</strong>
                </Typography>
                {renderChangeData(log.changeData)}
              </Grid>
            </Grid>
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default ImportDetailDetails;
