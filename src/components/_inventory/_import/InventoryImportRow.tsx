"use client";
import React from "react";
import { TableRow, TableCell, Chip } from "@mui/material";
import { InventoryImportItem } from "@/type/InventoryImport";

interface InventoryImportRowProps {
  item: InventoryImportItem;
}

const InventoryImportRow: React.FC<InventoryImportRowProps> = ({ item }) => {
  // Xác định màu của Chip dựa trên status
  let chipColor: "default" | "success" | "error" = "default";
  if (item.status === "Approved") chipColor = "success";
  else if (item.status === "Rejected") chipColor = "error";

  return (
    <TableRow
      hover
      sx={{
        transition: "background-color 0.3s ease",
        "&:hover": { backgroundColor: "grey.200" },
      }}
    >
      <TableCell>{item.importId}</TableCell>
      <TableCell>{item.referenceNumber}</TableCell>
      <TableCell>{item.createdByName}</TableCell>
      <TableCell>{new Date(item.createdDate).toLocaleString()}</TableCell>
      <TableCell>
        <Chip
        size="small"
          label={item.status}
          color={chipColor}
          sx={{ borderRadius: "16px", textTransform: "capitalize" }}
        />
      </TableCell>
      <TableCell>{item.totalCost}</TableCell>
      <TableCell>
        {item.approvedDate ? new Date(item.approvedDate).toLocaleString() : "-"}
      </TableCell>
      <TableCell>
        {item.completedDate ? new Date(item.completedDate).toLocaleString() : "-"}
      </TableCell>
    </TableRow>
  );
};

export default InventoryImportRow;
