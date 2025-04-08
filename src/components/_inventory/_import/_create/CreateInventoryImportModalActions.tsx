"use client";
import React from "react";
import { DialogActions, Button, Box } from "@mui/material";

export interface CreateInventoryImportModalActionsProps {
  loading: boolean;
  onCancel: () => void;
}

const CreateInventoryImportModalActions: React.FC<CreateInventoryImportModalActionsProps> = ({
  loading,
  onCancel,
}) => {
  return (
    <DialogActions sx={{ px: 0, justifyContent: "flex-end" }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Submitting..." : "Create Inventory Import"}
        </Button>
      </Box>
    </DialogActions>
  );
};

export default CreateInventoryImportModalActions;
