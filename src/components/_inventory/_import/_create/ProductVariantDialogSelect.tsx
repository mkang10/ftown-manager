"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Pagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import { productVariant } from "@/type/Product";
import { getProductVariants } from "@/ultis/importapi";

interface ProductVariantDialogSelectProps {
  open: boolean;
  onClose: () => void;
  onSelect: (variant: productVariant) => void;
}

const ProductVariantDialogSelect: React.FC<ProductVariantDialogSelectProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [variants, setVariants] = useState<productVariant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const pageSize = 5;

  useEffect(() => {
    if (open) {
      const fetchVariants = async () => {
        setLoading(true);
        try {
          const result = await getProductVariants(page, pageSize);
          setVariants(result.data);
          setTotalRecords(result.totalRecords);
        } catch (error) {
          setError("Không thể tải danh sách sản phẩm.");
        } finally {
          setLoading(false);
        }
      };
      fetchVariants();
    }
  }, [open, page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleSelect = (variant: productVariant) => {
    onSelect(variant);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          p: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem", color: "#111" }}>
        Chọn sản phẩm
      </DialogTitle>

      <DialogContent dividers sx={{ px: 1.5, py: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} color="inherit" />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error" sx={{ px: 1 }}>
            {error}
          </Typography>
        ) : variants.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
            Không có sản phẩm nào.
          </Typography>
        ) : (
          <>
            <List>
              {variants.map((variant) => (
                <ListItem key={variant.variantId} disableGutters>
                  <ListItemButton
                    onClick={() => handleSelect(variant)}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={variant.mainImagePath}
                        alt={variant.productName}
                        sx={{
                          width: 42,
                          height: 42,
                          border: "1px solid #ccc",
                          mr: 2,
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 500, color: "#111" }}>
                          {variant.productName}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {variant.sizeName} - {variant.colorName}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(totalRecords / pageSize)}
                page={page}
                onChange={handlePageChange}
                size="small"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#111",
                    borderColor: "#ccc",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#111",
                    color: "#fff",
                  },
                }}
              />
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariantDialogSelect;
