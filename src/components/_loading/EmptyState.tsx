"use client";

import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyStateProps {
  loading: boolean;
  message?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  loading,
  message = "No data available.",
  icon = <InboxIcon sx={{ fontSize: 80, color: "text.secondary" }} />,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      {icon && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
