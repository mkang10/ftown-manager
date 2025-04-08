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
          setError("Error loading product variants");
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
      PaperProps={{ sx: { p: 2, height: 400 } }}
    >
      <DialogTitle>Select Product Variant</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : variants.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No variants available.
          </Typography>
        ) : (
          <>
            <List>
              {variants.map((variant) => (
                <ListItem key={variant.variantId} disableGutters>
                  <ListItemButton onClick={() => handleSelect(variant)}>
                    <ListItemAvatar>
                      <Avatar
                        src={variant.mainImagePath}
                        alt={variant.productName}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={variant.productName}
                      secondary={`${variant.sizeName} - ${variant.colorName}`}
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
                color="primary"
              />
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductVariantDialogSelect;
