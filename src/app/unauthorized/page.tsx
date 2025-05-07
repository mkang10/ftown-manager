"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Bạn không có quyền truy cập vào trang web
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Vui lòng đăng nhập để tiếp tục
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.replace("/")}
        sx={{ backgroundColor: "#111", "&:hover": { backgroundColor: "#333" } }}
      >
        Đến trang đăng nhập
      </Button>
    </Box>
  );
}
