"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Paper, Typography, CircularProgress, Alert, Button } from "@mui/material";
import { getImportDetail } from "@/ultis/importapi";
import { ImportDetailResponse, InventoryImportItem } from "@/type/importdetail";
import ImportDetailBasic from "@/components/_inventory/_import/_detail/ImportDetailBasic";
import ImportDetailDetails from "@/components/_inventory/_import/_detail/ImportDetailDetail";

const ImportDetailClient: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const importId = Number(params.id);

  const [importDetail, setImportDetail] = useState<InventoryImportItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const response: ImportDetailResponse = await getImportDetail(importId);
        if (response.status) {
          setImportDetail(response.data);
        } else {
          setError(response.message || "Error fetching detail");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (importId) {
      fetchDetail();
    }
  }, [importId]);

  const handleBack = () => {
    router.back();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5", // Nền sáng nhẹ, dễ nhìn
        padding: 0,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          padding: 4,
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: "8px", // Bo tròn phần viền ngoài
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ nhẹ
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{
            mb: 2,
            borderColor: "#333",
            color: "#333",
            "&:hover": {
              borderColor: "#555",
              backgroundColor: "#f0f0f0", // Màu nền nhạt khi hover
              transform: "scale(1.05)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Hiệu ứng shadow khi hover
            },
            transition: "all 0.3s ease",
            padding: "8px 20px",
            borderRadius: "30px", // Bo tròn nút
            fontWeight: "bold",
          }}
        >
          Quay lại
        </Button>

        {loading ? (
          <CircularProgress sx={{ color: "#333", size: 50 }} />
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              mb: 2,
              borderRadius: "8px",
              backgroundColor: "#ffebe6", // Màu nền cho Alert
              color: "#d32f2f", // Màu chữ đỏ cho thông báo lỗi
            }}
          >
            {error}
          </Alert>
        ) : importDetail ? (
          <Paper
            sx={{
              p: 4,
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 3,
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)", // Bóng đổ nhẹ
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <ImportDetailBasic data={importDetail} />
            <ImportDetailDetails 
              details={importDetail.details} 
              auditLogs={importDetail.auditLogs || []} 
            />
          </Paper>
        ) : (
          <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
            Không tìm thấy dữ liệu.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImportDetailClient;