"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface VariantRowProps {
  index: number;
  unitPrice: number;
  quantity: number;
  allocatedQuantity: number;
  productDisplay: string;
  onVariantClick: (index: number) => void;
  onUnitPriceChange: (index: number, value: number) => void;
  onQuantityChange: (index: number, value: number) => void;
  onRemoveRow: (index: number) => void;
}

const VariantRow: React.FC<VariantRowProps> = ({
  index,
  unitPrice,
  quantity,
  allocatedQuantity,
  productDisplay,
  onVariantClick,
  onUnitPriceChange,
  onQuantityChange,
  onRemoveRow,
}) => {
  const [localUnitPrice, setLocalUnitPrice] = useState<string>(
    unitPrice !== 0 ? unitPrice.toString() : ""
  );
  const [localQuantity, setLocalQuantity] = useState<string>(
    quantity !== 0 ? quantity.toString() : ""
  );

  useEffect(() => {
    setLocalUnitPrice(unitPrice !== 0 ? unitPrice.toString() : "");
  }, [unitPrice]);

  useEffect(() => {
    setLocalQuantity(quantity !== 0 ? quantity.toString() : "");
  }, [quantity]);

  // Kiểm tra nếu giá trị hiện tại là số âm
  const parsedUnitPrice = parseFloat(localUnitPrice) || 0;
  const parsedQuantity = parseInt(localQuantity, 10) || 0;
  const unitPriceNegativeError = localUnitPrice !== "" && parsedUnitPrice < 0;
  const quantityNegativeError = localQuantity !== "" && parsedQuantity < 0;

  // Nếu giá trị nhập vào bắt đầu bằng "0" (và không rỗng) thì "đóng băng" input
  const freezeUnitPrice = localUnitPrice !== "" && localUnitPrice[0] === "0";
  const freezeQuantity = localQuantity !== "" && localQuantity[0] === "0";

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        p: 2,
        borderRadius: 1,
        position: "relative",
        mb: 2,
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <TextField
          label="Product Variant"
          value={productDisplay}
          onClick={() => onVariantClick(index)}
          fullWidth
          InputProps={{
            readOnly: true,
            sx: {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
            },
          }}
          placeholder="Select Product Variant"
        />
        {index > 0 && (
          <IconButton onClick={() => onRemoveRow(index)} sx={{ ml: 1 }} size="small">
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Box>
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Unit Price"
          type="number"
          value={localUnitPrice}
          onChange={(e) => {
            const newValue = e.target.value;
            // Nếu nhập bắt đầu bằng "0", không cập nhật state (cho phép xóa lại)
            if (newValue !== "" && newValue[0] === "0") return;
            setLocalUnitPrice(newValue);
            const num = newValue === "" ? 0 : parseFloat(newValue);
            onUnitPriceChange(index, isNaN(num) ? 0 : num);
          }}
          fullWidth
          inputProps={{ min: 0 }}
          error={unitPriceNegativeError || freezeUnitPrice}
          helperText={
            freezeUnitPrice
              ? "Unit Price không được bắt đầu bằng số 0. Vui lòng xóa số 0."
              : unitPriceNegativeError
              ? "Unit Price must be non-negative"
              : ""
          }
        />
        <TextField
          label="Quantity"
          type="number"
          value={localQuantity}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue !== "" && newValue[0] === "0") return;
            setLocalQuantity(newValue);
            const num = newValue === "" ? 0 : parseInt(newValue, 10);
            onQuantityChange(index, isNaN(num) ? 0 : num);
          }}
          fullWidth
          inputProps={{ min: 0 }}
          error={quantityNegativeError || freezeQuantity}
          helperText={
            freezeQuantity
              ? "Quantity không được bắt đầu bằng số 0. Vui lòng xóa số 0."
              : quantityNegativeError
              ? "Quantity must be non-negative"
              : ""
          }
        />
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Allocated Quantity: {allocatedQuantity}
        </Typography>
      </Box>
    </Box>
  );
};

export default VariantRow;
