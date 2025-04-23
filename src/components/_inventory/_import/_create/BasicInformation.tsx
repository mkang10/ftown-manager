"use client";
import React from "react";
import { Box, TextField, Typography } from "@mui/material";

export interface BasicInformationProps {
  selectedVariantId: number;
  costPrice: number;
  oncostPriceChange: (value: number) => void;
  onProductVariantChange: (variantId: number) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  selectedVariantId,
  costPrice,
  oncostPriceChange,
  onProductVariantChange,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Basic Information</Typography>
      <TextField
        label="Product Variant ID"
        type="number"
        value={selectedVariantId}
        onChange={(e) => onProductVariantChange(parseInt(e.target.value))}
        fullWidth
      />
      <TextField
        label="Unit Price"
        type="number"
        value={costPrice}
        onChange={(e) => oncostPriceChange(parseFloat(e.target.value))}
        fullWidth
      />
    </Box>
  );
};

export default BasicInformation;
