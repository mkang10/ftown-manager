"use client";
import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { InventoryImportItem } from "@/type/InventoryImport";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "grey.500"; 
    case "Approved":
      return "success.main"; 
    case "rejected":
      return "error.main";   
    case "Processing":
      return "#ffee33";
    case "done":
      return "#00695c";
    default:
      return "grey.500";  
  }
};

interface StaffAssignTableProps {
  items: InventoryImportItem[];
  onAssign: (importId: number) => void;
}

const StaffAssignTable: React.FC<StaffAssignTableProps> = ({ items, onAssign }) => {
  return (
    <Table sx={{ backgroundColor: "white" }}>
      <TableHead>
        <TableRow>
          <TableCell>Import Id</TableCell>
          <TableCell>Created By Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Created Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Reference Number</TableCell>
          <TableCell>Total Cost</TableCell>
          <TableCell>Approved Date</TableCell>
          <TableCell>Completed Date</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.importId}>
            <TableCell>{item.importId}</TableCell>
            <TableCell>{item.createdByName}</TableCell>
            <TableCell>{item.email || "-"}</TableCell>
            <TableCell>{new Date(item.createdDate).toLocaleDateString()}</TableCell>
            <TableCell sx={{ color: getStatusColor(item.status), fontWeight: "bold" }}>
              {item.status}
            </TableCell>
            <TableCell>{item.referenceNumber}</TableCell>
            <TableCell>{item.totalCost}</TableCell>
            <TableCell>
              {item.approvedDate ? new Date(item.approvedDate).toLocaleDateString() : "-"}
            </TableCell>
            <TableCell>
              {item.completedDate ? new Date(item.completedDate).toLocaleDateString() : "-"}
            </TableCell>
            <TableCell>
              <Button variant="contained" size="small" onClick={() => onAssign(item.importId)}>
                Assign
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StaffAssignTable;
