"use client";
// components/inventory/import/ImportDetailBasic.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { InventoryImportItem } from "@/type/importdetail";

interface ImportDetailBasicProps {
  data: InventoryImportItem;
}

const ImportDetailBasic: React.FC<ImportDetailBasicProps> = ({ data }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        padding: 3,
        borderRadius: 1,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ddd",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#000" }}>
        Chi tiết nhập kho #{data.importId}
      </Typography>

      <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
        <strong>Số tham chiếu:</strong> {data.referenceNumber}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
        <strong>Người tạo:</strong> {data.createdByName}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
        <strong>Ngày tạo:</strong> {new Date(data.createdDate).toLocaleString()}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
        <strong>Trạng thái:</strong> {data.status}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
        <strong>Tổng chi phí:</strong> {data.totalCost.toLocaleString()} VND
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
        <strong>Ngày phê duyệt:</strong>{" "}
        {data.approvedDate ? new Date(data.approvedDate).toLocaleString() : "-"}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "#333" }}>
        <strong>Ngày hoàn thành:</strong>{" "}
        {data.completedDate ? new Date(data.completedDate).toLocaleString() : "-"}
      </Typography>
    </Box>
  );
};

export default ImportDetailBasic;
