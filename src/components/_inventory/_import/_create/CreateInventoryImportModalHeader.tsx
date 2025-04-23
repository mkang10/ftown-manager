"use client";
import React from "react";
import { DialogTitle, Typography } from "@mui/material";

const CreateInventoryImportModalHeader: React.FC = () => {
  return (
    <DialogTitle sx={{ px: 4, pt: 3, pb: 2, backgroundColor: "#fff" }}>
      <Typography
        variant="h5"
        fontWeight="600"
        color="black"
        sx={{ letterSpacing: 0.5 }}
      >
        Tạo phiếu nhập kho
      </Typography>
    </DialogTitle>
  );
};

export default CreateInventoryImportModalHeader;
