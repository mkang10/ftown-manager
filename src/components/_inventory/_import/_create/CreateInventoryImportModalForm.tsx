"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductVariantDialogSelect from "./ProductVariantDialogSelect";
import VariantRow from "./VariantRow";
import { productVariant } from "@/type/Product";
import { InventoryImportCreateRequest } from "@/type/createInventoryImport";

export interface CreateInventoryImportModalFormProps {
  formData: InventoryImportCreateRequest;
  onProductVariantChange: (variantId: number, rowIndex: number) => void;
  onChange: (newData: InventoryImportCreateRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  onQuantityChange: (index: number, value: number) => void;
}

const CreateInventoryImportModalForm: React.FC<CreateInventoryImportModalFormProps> = ({
  formData,
  onProductVariantChange,
  onChange,
  onSubmit,
  loading,
  onQuantityChange,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [productDisplayArray, setProductDisplayArray] = useState<string[]>(
    formData.importDetails.map(() => "")
  );
  const [notification, setNotification] = useState("");

  useEffect(() => {
    setProductDisplayArray((prev) => {
      const newArray = [...prev];
      while (newArray.length < formData.importDetails.length) {
        newArray.push("");
      }
      while (newArray.length > formData.importDetails.length) {
        newArray.pop();
      }
      return newArray;
    });
  }, [formData.importDetails.length]);

  const handleAddRow = () => {
    let defaultWareHouseId = 0;
    let defaultHandleBy = 0;
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      const account = JSON.parse(storedAccount);
      defaultWareHouseId = account.roleDetails?.storeId || 0;
      defaultHandleBy = account.roleDetails?.shopManagerDetailId || 0;
    }
    const newRow = {
      productVariantId: 0,
      costPrice: 0,
      quantity: 0,
      storeDetails: [
        {
          wareHouseId: defaultWareHouseId,
          allocatedQuantity: 0,
          handleBy: defaultHandleBy,
        },
      ],
    };
    onChange({ ...formData, importDetails: [...formData.importDetails, newRow] });
  };

  const handleRemoveRow = (rowIndex: number) => {
    if (formData.importDetails.length === 1) return;
    const newDetails = formData.importDetails.filter((_, idx) => idx !== rowIndex);
    onChange({ ...formData, importDetails: newDetails });
    setProductDisplayArray((prev) => prev.filter((_, idx) => idx !== rowIndex));
  };

  const handleOpenDialog = (rowIndex: number) => {
    setSelectedRow(rowIndex);
    setOpenDialog(true);
  };

  const handleVariantSelect = (variant: productVariant) => {
    const selectedRowData = formData.importDetails[selectedRow];
    const duplicateRowIndex = formData.importDetails.findIndex(
      (detail, idx) => idx !== selectedRow && detail.productVariantId === variant.variantId
    );

    if (duplicateRowIndex !== -1) {
      const duplicateRow = formData.importDetails[duplicateRowIndex];
      const mergedCostPrice = duplicateRow.costPrice + selectedRowData.costPrice;
      const mergedQuantity = duplicateRow.quantity + selectedRowData.quantity;
      const mergedStoreDetails = duplicateRow.storeDetails.map((store, i) => {
        if (i === 0) {
          return {
            ...store,
            allocatedQuantity:
              store.allocatedQuantity +
              selectedRowData.storeDetails[0].allocatedQuantity,
          };
        }
        return store;
      });

      const updatedDuplicateRow = {
        ...duplicateRow,
        productVariantId: variant.variantId,
        costPrice: mergedCostPrice,
        quantity: mergedQuantity,
        storeDetails: mergedStoreDetails,
      };

      const newDetails = formData.importDetails.filter((_, idx) => idx !== selectedRow);
      newDetails[duplicateRowIndex] = updatedDuplicateRow;

      const newDisplayArray = productDisplayArray.filter((_, idx) => idx !== selectedRow);
      newDisplayArray[duplicateRowIndex] = `${variant.productName} - ${variant.sizeName} - ${variant.colorName}`;

      onChange({ ...formData, importDetails: newDetails });
      setProductDisplayArray(newDisplayArray);
      setNotification("Sản phẩm đã được gộp vào dòng hiện có.");
    } else {
      const newDetails = formData.importDetails.map((detail, idx) =>
        idx === selectedRow ? { ...detail, productVariantId: variant.variantId } : detail
      );
      onChange({ ...formData, importDetails: newDetails });
      setProductDisplayArray((prev) => {
        const newArray = [...prev];
        newArray[selectedRow] = `${variant.productName} - ${variant.sizeName} - ${variant.colorName}`;
        return newArray;
      });
    }

    onProductVariantChange(variant.variantId, selectedRow);
    setOpenDialog(false);
  };

  const handleCostPriceChange = (index: number, value: number) => {
    const newDetails = formData.importDetails.map((d, i) =>
      i === index ? { ...d, costPrice: value } : d
    );
    onChange({ ...formData, importDetails: newDetails });
  };

  const handleQuantityChange = (index: number, value: number) => {
    const newDetails = formData.importDetails.map((d, i) => {
      if (i === index) {
        const newStoreDetails = d.storeDetails.length === 1
          ? d.storeDetails.map((store) => ({ ...store, allocatedQuantity: value }))
          : d.storeDetails;
        return { ...d, quantity: value, storeDetails: newStoreDetails };
      }
      return d;
    });
    onChange({ ...formData, importDetails: newDetails });
    onQuantityChange(index, value);
  };

  const handleCloseNotification = () => setNotification("");

  return (
    <Paper sx={{
      p: 4,
      mb: 4,
      backgroundColor: "#f9f9f9",
      border: "1px solid #e0e0e0",
      borderRadius: 4
    }}>
      <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#111" }}>
          Thông tin nhập kho
        </Typography>

        {formData.importDetails.map((detail, index) => (
          <VariantRow
            key={index}
            index={index}
            costPrice={detail.costPrice}
            quantity={detail.quantity}
            allocatedQuantity={detail.storeDetails[0].allocatedQuantity}
            productDisplay={detail.productVariantId ? productDisplayArray[index] : ""}
            onVariantClick={handleOpenDialog}
            oncostPriceChange={handleCostPriceChange}
            onQuantityChange={handleQuantityChange}
            onRemoveRow={handleRemoveRow}
          />
        ))}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            sx={{
              color: "#000",
              borderColor: "#000",
              "&:hover": {
                backgroundColor: "#000",
                color: "#fff",
              },
            }}
          >
            Thêm sản phẩm
          </Button>
        </Box>

        <Divider sx={{ mt: 3, borderColor: "#ccc" }} />
      </Box>

      <ProductVariantDialogSelect
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSelect={handleVariantSelect}
      />

      <Snackbar open={notification !== ""} autoHideDuration={3000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity="info" sx={{ width: "100%" }}>
          {notification}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateInventoryImportModalForm;
