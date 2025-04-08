// components/inventory/import/ImportDetailBasic.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { InventoryImportItem } from "@/type/importdetail";
interface ImportDetailBasicProps {
  data: InventoryImportItem;
}

const ImportDetailBasic: React.FC<ImportDetailBasicProps> = ({ data }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Import Detail #{data.importId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Reference Number:</strong> {data.referenceNumber}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Created By:</strong> {data.createdByName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Created Date:</strong> {new Date(data.createdDate).toLocaleString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Status:</strong> {data.status}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Total Cost:</strong> {data.totalCost}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Approved Date:</strong>{" "}
        {data.approvedDate ? new Date(data.approvedDate).toLocaleString() : "-"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Completed Date:</strong>{" "}
        {data.completedDate ? new Date(data.completedDate).toLocaleString() : "-"}
      </Typography>
    </Box>
  );
};

export default ImportDetailBasic;
