// components/_inventory/_import/ProductDetails.tsx
"use client";

import React from "react";
import { Grid, TextField } from "@mui/material";

interface ProductDetailsProps {
  quantity: number;
  onQuantityChange: (value: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ quantity, onQuantityChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
