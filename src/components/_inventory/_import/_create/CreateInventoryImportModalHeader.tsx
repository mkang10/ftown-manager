"use client";
import React from "react";
import { DialogTitle, Typography } from "@mui/material";

const CreateInventoryImportModalHeader: React.FC = () => {
  return (
    <DialogTitle>
      <Typography variant="h4" fontWeight="bold" color="text.primary">
        Create Inventory Import
      </Typography>
    </DialogTitle>
  );
};

export default CreateInventoryImportModalHeader;
