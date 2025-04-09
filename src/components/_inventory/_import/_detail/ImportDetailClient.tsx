// components/_inventory/_import/_detail/ImportDetailClient.tsx
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
    router.back(); // Hoặc sử dụng router.push("/inventory/import")
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Back
      </Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : importDetail ? (
        <Paper sx={{ p: 3 }}>
          <ImportDetailBasic data={importDetail} />
          <ImportDetailDetails 
            details={importDetail.details} 
            auditLogs={importDetail.auditLogs || []} 
          />
        </Paper>
      ) : (
        <Typography>No data found.</Typography>
      )}
    </Box>
  );
};

export default ImportDetailClient;
