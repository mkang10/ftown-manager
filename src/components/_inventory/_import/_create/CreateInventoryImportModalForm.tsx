"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Paper, Button, Snackbar, Alert } from "@mui/material";
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
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [productDisplayArray, setProductDisplayArray] = useState<string[]>(
    formData.importDetails.map(() => "")
  );
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    // Đồng bộ mảng hiển thị với số dòng importDetails
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

  // Hàm thêm dòng mới: mỗi row luôn có storeDetails với handleBy
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
      unitPrice: 0,
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

  // Hàm xóa dòng: chỉ cho phép xóa nếu có nhiều hơn 1 row
  const handleRemoveRow = (rowIndex: number) => {
    if (formData.importDetails.length === 1) return;
    const newDetails = formData.importDetails.filter((_, idx) => idx !== rowIndex);
    onChange({ ...formData, importDetails: newDetails });
    setProductDisplayArray((prev) => prev.filter((_, idx) => idx !== rowIndex));
  };

  // Mở dialog chọn variant cho dòng được chọn
  const handleOpenDialog = (rowIndex: number) => {
    setSelectedRow(rowIndex);
    setOpenDialog(true);
  };

  // Khi chọn variant từ dialog
  const handleVariantSelect = (variant: productVariant) => {
    const selectedRowData = formData.importDetails[selectedRow];

    // Kiểm tra xem có row nào (khác selectedRow) đã có variantId giống nhau không
    const duplicateRowIndex = formData.importDetails.findIndex(
      (detail, idx) => idx !== selectedRow && detail.productVariantId === variant.variantId
    );

    if (duplicateRowIndex !== -1) {
      // Nếu có row trùng: gộp giá trị của selectedRowData vào row duplicate
      const duplicateRow = formData.importDetails[duplicateRowIndex];

      const mergedUnitPrice = duplicateRow.unitPrice + selectedRowData.unitPrice;
      const mergedQuantity = duplicateRow.quantity + selectedRowData.quantity;
      const mergedStoreDetails = duplicateRow.storeDetails.map((store, i) => {
        // Giả sử chỉ xử lý phần tử đầu tiên trong storeDetails
        if (i === 0) {
          return {
            ...store,
            allocatedQuantity:
              store.allocatedQuantity +
              selectedRowData.storeDetails[0].allocatedQuantity,
            // Giữ nguyên handleBy của store đã có (hoặc có thể cập nhật nếu cần)
          };
        }
        return store;
      });

      const updatedDuplicateRow = {
        ...duplicateRow,
        productVariantId: variant.variantId,
        unitPrice: mergedUnitPrice,
        quantity: mergedQuantity,
        storeDetails: mergedStoreDetails,
      };

      // Loại bỏ row đang được chọn và cập nhật row duplicate
      const newDetails = formData.importDetails.filter((_, idx) => idx !== selectedRow);
      newDetails[duplicateRowIndex] = updatedDuplicateRow;

      // Cập nhật mảng hiển thị sản phẩm tương ứng
      const newDisplayArray = productDisplayArray.filter((_, idx) => idx !== selectedRow);
      newDisplayArray[duplicateRowIndex] = `${variant.productName} - ${variant.sizeName} - ${variant.colorName}`;

      onChange({ ...formData, importDetails: newDetails });
      setProductDisplayArray(newDisplayArray);

      // Hiển thị thông báo
      setNotification("Sản phẩm đã được chọn");
    } else {
      // Nếu không có trùng: cập nhật row đang chọn
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

  // Cập nhật unit price của một row cụ thể
  const handleUnitPriceChange = (index: number, value: number) => {
    const newDetails = formData.importDetails.map((d, i) => {
      if (i === index) {
        return { ...d, unitPrice: value };
      }
      return d;
    });
    onChange({ ...formData, importDetails: newDetails });
  };

  // Cập nhật quantity và đồng bộ allocatedQuantity của row tương ứng
  // Cập nhật tổng quantity.
// Nếu chỉ có 1 store thì đồng bộ allocatedQuantity = quantity,
// nếu nhiều store thì để VariantRow quản lý phân phối.
const handleQuantityChange = (index: number, value: number) => {
  const newDetails = formData.importDetails.map((d, i) => {
    if (i === index) {
      let newStoreDetails;
      if (d.storeDetails.length === 1) {
        // Nếu chỉ có 1 warehouse thì gán allocatedQuantity = value
        newStoreDetails = d.storeDetails.map((store) => ({ ...store, allocatedQuantity: value }));
      } else {
        newStoreDetails = d.storeDetails;
      }
      return { ...d, quantity: value, storeDetails: newStoreDetails };
    }
    return d;
  });
  onChange({ ...formData, importDetails: newDetails });
  onQuantityChange(index, value);
};


  // Đóng thông báo
  const handleCloseNotification = () => {
    setNotification("");
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Typography variant="h6">Basic Information</Typography>
        {formData.importDetails.map((detail, index) => (
          <VariantRow
            key={index}
            index={index}
            unitPrice={detail.unitPrice}
            quantity={detail.quantity}
            allocatedQuantity={detail.storeDetails[0].allocatedQuantity}
            productDisplay={detail.productVariantId ? productDisplayArray[index] : ""}
            onVariantClick={handleOpenDialog}
            onUnitPriceChange={handleUnitPriceChange}
            onQuantityChange={handleQuantityChange}
            onRemoveRow={handleRemoveRow}
          />
        ))}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRow}>
            Add Variant
          </Button>
        </Box>
        <Divider />
      </Box>
      <ProductVariantDialogSelect
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSelect={handleVariantSelect}
      />
      <Snackbar
        open={notification !== ""}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity="info" sx={{ width: "100%" }}>
          {notification}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateInventoryImportModalForm;
