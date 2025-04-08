"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Alert, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import CreateInventoryImportModalHeader from "./CreateInventoryImportModalHeader";
import CreateInventoryImportModalForm from "./CreateInventoryImportModalForm";
import CreateInventoryImportModalActions from "./CreateInventoryImportModalActions";
import { InventoryImportCreateRequest, InventoryImportCreateResponse } from "@/type/createInventoryImport";
import { createInventoryImport } from "@/ultis/importapi";
import { toast } from "react-toastify";

interface CreateInventoryImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback khi tạo đơn thành công
}

const CreateInventoryImportModal: React.FC<CreateInventoryImportModalProps> = ({ open, onClose, onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<InventoryImportCreateRequest>({
    createdBy: 0,
    handleBy: 0,
    originalImportId: null,
    importDetails: [
      {
        productVariantId: 0,
        unitPrice: 0,
        quantity: 0,
        storeDetails: [
          { 
            wareHouseId: 0, 
            allocatedQuantity: 0, 
            handleBy: 0 
          },
        ],
      },
    ],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Khi modal mở, cập nhật thông tin từ localStorage
  useEffect(() => {
    if (open) {
      const storedAccount = localStorage.getItem("account");
      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        setFormData((prev) => ({
          ...prev,
          createdBy: account.accountId,
          handleBy: account.roleDetails?.shopManagerDetailId || account.accountId,
          importDetails: prev.importDetails.map((detail) => ({
            ...detail,
            storeDetails: detail.storeDetails.map((store) => ({
              ...store,
              wareHouseId: account.roleDetails?.storeId ?? 0,
              allocatedQuantity: detail.quantity,
              handleBy: account.roleDetails?.shopManagerDetailId || account.accountId,
            })),
          })),
        }));
      }
    }
  }, [open]);

  const handleProductVariantChange = (variantId: number, rowIndex: number) => {
    setFormData((prev) => {
      const newDetails = [...prev.importDetails];
      newDetails[rowIndex].productVariantId = variantId;
      return { ...prev, importDetails: newDetails };
    });
  };

  const handleUnitPriceChange = (rowIndex: number, value: number) => {
    setFormData((prev) => {
      const newDetails = [...prev.importDetails];
      newDetails[rowIndex].unitPrice = value;
      return { ...prev, importDetails: newDetails };
    });
  };

  const handleQuantityChange = (rowIndex: number, value: number) => {
    setFormData((prev) => {
      const newDetails = [...prev.importDetails];
      newDetails[rowIndex].quantity = value;
      newDetails[rowIndex].storeDetails = newDetails[rowIndex].storeDetails.map((store) => ({
        ...store,
        allocatedQuantity: value,
      }));
      return { ...prev, importDetails: newDetails };
    });
  };

  // Hàm submit tích hợp: trước khi tạo, kiểm tra nếu có giá trị âm thì báo lỗi và không tạo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra các dòng: nếu unitPrice hoặc quantity âm thì không cho tạo
    const hasNegative = formData.importDetails.some(
      (detail) => detail.unitPrice < 0 || detail.quantity < 0
    );
    if (hasNegative) {
      setError("Giá hoặc số lượng không được âm. Vui lòng kiểm tra lại.");
      toast.error("Giá hoặc số lượng không được âm. Vui lòng kiểm tra lại.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data: InventoryImportCreateResponse = await createInventoryImport(formData);
      if (data.status) {
        toast.success("Inventory Import created successfully!");
        onClose();
        onSuccess();
      } else {
        setError(data.message);
        toast.error(data.message || "Creation failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Có lỗi xảy ra khi tạo Inventory Import.");
      toast.error("Có lỗi xảy ra khi tạo Inventory Import.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <CreateInventoryImportModalHeader />
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <CreateInventoryImportModalForm
            formData={formData}
            onProductVariantChange={handleProductVariantChange}
            onQuantityChange={handleQuantityChange}
            onChange={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
          />
          <CreateInventoryImportModalActions loading={loading} onCancel={handleCancel} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInventoryImportModal;
