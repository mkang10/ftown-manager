"use client";
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { Dispatch } from "@/type/dispatch";
import StaffAssignDispatch from "./StaffAssignDispatch";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "grey.500";
    case "approved":
      return "success.main";
    case "rejected":
      return "error.main";
    case "processing":
      return "#ffee33";
    case "done":
    case "completed":
      return "#00695c";
    default:
      return "grey.500";
  }
};

interface DispatchTableProps {
  items: Dispatch[];
  onRefresh: () => void; // callback để reload danh sách sau khi assign
}

const DispatchTable: React.FC<DispatchTableProps> = ({ items, onRefresh }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpenAssign = (dispatchId: number) => {
    setSelectedId(dispatchId);
  };

  const handleCloseAssign = () => {
    setSelectedId(null);
  };

  const handleAssigned = () => {
    handleCloseAssign();
    onRefresh(); // refresh lại bảng
  };

  return (
    <>
      <Table sx={{ backgroundColor: "white" }}>
        <TableHead>
          <TableRow>
            <TableCell>Dispatch ID</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Reference #</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Completed Date</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((d) => (
            <TableRow key={d.dispatchId}>
              <TableCell>{d.dispatchId}</TableCell>
              <TableCell>{d.createdByName}</TableCell>
              <TableCell>
                {new Date(d.createdDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{d.referenceNumber}</TableCell>
              <TableCell
                sx={{
                  color: getStatusColor(d.status),
                  fontWeight: "bold",
                }}
              >
                {d.status}
              </TableCell>
              <TableCell>
                {d.completedDate
                  ? new Date(d.completedDate).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>{d.remarks || "-"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleOpenAssign(d.dispatchId)}
                >
                  Assign
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog assign */}
      {selectedId !== null && (
        <StaffAssignDispatch
          open={true}
          dispatchId={selectedId}
          onClose={handleCloseAssign}
          onAssigned={handleAssigned}
        />
      )}
    </>
  );
};

export default DispatchTable;
