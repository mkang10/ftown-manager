// components/_staff-assign/DispatchTable.tsx
"use client";

import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Box,
  Chip,
  Tooltip,
  Button,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import StaffAssignDispatch from "./StaffAssignDispatch";
import { Dispatch } from "@/type/dispatch";

interface DispatchTableProps {
  items: Dispatch[];
  onRefresh: () => void;
}

const statusColorMap: Record<string, string> = {
  pending: "grey",
  approved: "success",
  rejected: "error",
  processing: "warning",
  done: "info",
  completed: "info",
};

export default function DispatchTable({ items, onRefresh }: DispatchTableProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();
  const theme = useTheme();

  const handleOpenAssign = (dispatchId: number) => {
    setSelectedId(dispatchId);
  };
  const handleCloseAssign = () => {
    setSelectedId(null);
  };
  const handleAssigned = () => {
    handleCloseAssign();
    onRefresh();
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
          overflow: "hidden",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              {[
                "Dispatch ID",
                "Created By",
                "Created Date",
                "Reference #",
                "Status",
                "Completed Date",
                "Remarks",
              ].map((header) => (
                <TableCell key={header}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((d) => (
              <TableRow
                key={d.dispatchId}
                hover
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: theme.palette.action.hover } }}
                onClick={() => router.push(`/assign/dispatch/${d.dispatchId}`)}
              >
                <TableCell>{d.dispatchId}</TableCell>
                <TableCell>
                  <Typography noWrap>{d.createdByName}</Typography>
                </TableCell>
                <TableCell>
                  {new Date(d.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography noWrap>{d.referenceNumber}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={d.status}
                    color={
                      statusColorMap[d.status.toLowerCase()] as any
                    }
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  {d.completedDate
                    ? new Date(d.completedDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Tooltip title={d.remarks || "-"} arrow>
                    <Typography noWrap sx={{ maxWidth: 150 }}>
                      {d.remarks || "-"}
                    </Typography>
                  </Tooltip>
                </TableCell>
             
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedId !== null && (
        <StaffAssignDispatch
          open
          dispatchId={selectedId}
          onClose={handleCloseAssign}
          onAssigned={handleAssigned}
        />
      )}
    </>
  );
}