"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TableSortLabel,
  Typography,
  Tooltip,
} from "@mui/material";
import { InventoryImportItem } from "@/type/InventoryImport";
import { useRouter } from "next/navigation";
import { getStatusColor } from "@/ultis/UI";

interface InventoryImportTableProps {
  items: InventoryImportItem[];
  sortBy: string;
  isDescending: boolean;
  onSortChange: (sortField: string, isDescending: boolean) => void;
}

const InventoryImportTable: React.FC<InventoryImportTableProps> = ({
  items,
  sortBy,
  isDescending,
  onSortChange,
}) => {
  const router = useRouter();

  const handleRowClick = (importId: number) => {
    router.push(`/inventory/import/${importId}`);
  };

  const createSortHandler = (field: string) => () => {
    const isActive = sortBy === field;
    const newIsDescending = isActive ? !isDescending : false;
    onSortChange(field, newIsDescending);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ borderRadius: "12px", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "white" }}>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 80 }}>
                  <TableSortLabel
                    active={sortBy === "ImportId"}
                    direction={sortBy === "ImportId" ? (isDescending ? "desc" : "asc") : "asc"}
                    onClick={createSortHandler("ImportId")}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 150 }}>
                  <TableSortLabel
                    active={sortBy === "ReferenceNumber"}
                    direction={sortBy === "ReferenceNumber" ? (isDescending ? "desc" : "asc") : "asc"}
                    onClick={createSortHandler("ReferenceNumber")}
                  >
                    Reference Number
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 150 }}>
                  <TableSortLabel
                    active={sortBy === "CreatedByName"}
                    direction={sortBy === "CreatedByName" ? (isDescending ? "desc" : "asc") : "asc"}
                    onClick={createSortHandler("CreatedByName")}
                  >
                    Created By
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 180 }}>
                  <TableSortLabel
                    active={sortBy === "CreatedDate"}
                    direction={sortBy === "CreatedDate" ? (isDescending ? "desc" : "asc") : "asc"}
                    onClick={createSortHandler("CreatedDate")}
                  >
                    Created Date
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 120 }}>
                  <TableSortLabel
                    active={sortBy === "Status"}
                    direction={sortBy === "Status" ? (isDescending ? "desc" : "asc") : "asc"}
                    onClick={createSortHandler("Status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: 120 }}>
                  <TableSortLabel
                    active={sortBy === "TotalCost"}
                    direction={sortBy === "TotalCost" ? (isDescending ? "desc" : "asc") : "asc"}
                    onClick={createSortHandler("TotalCost")}
                  >
                    Total Cost
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.importId}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                  onClick={() => handleRowClick(item.importId)}
                >
                  <TableCell align="center">{item.importId}</TableCell>
                  <TableCell align="center">{item.referenceNumber}</TableCell>
                  <TableCell align="center">{item.createdByName}</TableCell>
                  <TableCell align="center">{new Date(item.createdDate).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    {item.status === "Partial Success" ? (
                      <Tooltip title="This import has missing items">
                        <Box
                          sx={{
                            backgroundColor: getStatusColor(item.status),
                            color: "white",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            width: 150,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            mx: "auto",
                          }}
                        >
                          {item.status}
                        </Box>
                      </Tooltip>
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: getStatusColor(item.status),
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "12px",
                          width: 150,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          mx: "auto",
                        }}
                      >
                        {item.status}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="center">{item.totalCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InventoryImportTable;
