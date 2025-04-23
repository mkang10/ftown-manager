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
  pending: "default",
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

  const handleOpenAssign = (dispatchId: number) => setSelectedId(dispatchId);
  const handleCloseAssign = () => setSelectedId(null);
  const handleAssigned = () => {
    handleCloseAssign();
    onRefresh();
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          mt: 4,
          overflow: "hidden",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f8f8" }}>
              {[
                "Mã phiếu",
                "Người tạo",
                "Ngày tạo",
                "Mã tham chiếu",
                "Trạng thái",
                "Ngày hoàn tất",
                "Ghi chú",
                "Hành động",
              ].map((header) => (
                <TableCell key={header}>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
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
                onClick={() => router.push(`/assign/dispatch/${d.dispatchId}`)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#f2f2f2",
                  },
                }}
              >
                <TableCell>{d.dispatchId}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {d.createdByName}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(d.createdDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {d.referenceNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={d.status}
                    color={statusColorMap[d.status.toLowerCase()] as any}
                    size="small"
                    sx={{ textTransform: "capitalize", fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  {d.completedDate ? new Date(d.completedDate).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  <Tooltip title={d.remarks || "-"} arrow>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {d.remarks || "-"}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 500,
                      px: 2,
                      backgroundColor: "#000",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: "#222",
                      },
                    }}
                    onClick={() => handleOpenAssign(d.dispatchId)}
                  >
                    Giao việc
                  </Button>
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
