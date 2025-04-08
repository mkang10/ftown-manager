"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/layout/DasboardLayout";
import { Box, Paper, Typography, CircularProgress, Alert, Button } from "@mui/material";
import { getImportDetail } from "@/ultis/importapi";
import { ImportDetailResponse, InventoryImportItem } from "@/type/importdetail";
import ImportDetailBasic from "@/components/_inventory/_import/_detail/ImportDetailBasic";
import ImportDetailDetails from "@/components/_inventory/_import/_detail/ImportDetailDetail";

const ImportDetailPage: React.FC = () => {
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
    router.back(); // Hoặc router.push("/inventory/import")
  };

  return (
    <DashboardLayout>
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
            {/* Truyền cả details và auditLogs vào component */}
            <ImportDetailDetails 
              details={importDetail.details} 
              auditLogs={importDetail.auditLogs || []} 
            />
          </Paper>
        ) : (
          <Typography>No data found.</Typography>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default ImportDetailPage;
