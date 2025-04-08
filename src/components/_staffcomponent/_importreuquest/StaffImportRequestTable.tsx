import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  TableSortLabel,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { StaffInventoryImportStoreDetailDto } from "@/type/importStaff";
import { updateFullStock, updateShortage } from "@/ultis/importapi";
import CommentDialog from "./CommentDialog";
import EmptyState from "@/components/_loading/EmptyState";

type ActionType = "FullStock" | "Shortage";

interface StaffImportRequestTableProps {
  items: StaffInventoryImportStoreDetailDto[];
  loading: boolean;
  onSortChange: (sortField: string, isDescending: boolean) => void;
  sortBy: string;
  isDescending: boolean;
  refreshData: () => void;
}

const getStatusColor = (status: string) => {
  const normalizedStatus = status.trim();
  switch (normalizedStatus) {
    case "Success":
      return "success";
    case "Processing":
      return "warning";
    case "Failed":
      return "error";
    case "Shortage":
      return "info";
    default:
      return "default";
  }
};

const StaffImportRequestTable: React.FC<StaffImportRequestTableProps> = ({
  items,
  loading,
  onSortChange,
  sortBy,
  isDescending,
  refreshData,
}) => {
  // Debug log để kiểm tra dữ liệu
  console.log("StaffImportRequestTable - loading:", loading, "items:", items);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] =
    useState<StaffInventoryImportStoreDetailDto | null>(null);
  const [actionType, setActionType] = useState<ActionType>("FullStock");

  const createSortHandler = (property: string) => () => {
    let newDesc = false;
    if (sortBy === property) {
      newDesc = !isDescending;
    }
    onSortChange(property, newDesc);
  };

  const handleOpenDialog = (
    item: StaffInventoryImportStoreDetailDto,
    action: ActionType
  ) => {
    setSelectedItem(item);
    setActionType(action);
    setOpenDialog(true);
  };

  // Khi người dùng submit comment và actualReceivedQuantity từ dialog
  const handleSubmitComment = async (comment: string, actualReceivedQuantity: number) => {
    if (!selectedItem) return;
    try {
      const storedAccount = localStorage.getItem("account");
      let staffId = 0;
      if (storedAccount) {
        const account = JSON.parse(storedAccount);
        staffId = account.roleDetails?.staffDetailId || 0;
      }
  
      const details = [
        {
          storeDetailId: selectedItem.importStoreId,
          actualReceivedQuantity: actualReceivedQuantity,
          comment: comment,
        },
      ];
  
      let result;
      if (actionType === "FullStock") {
        result = await updateFullStock(selectedItem.importId, staffId, details);
      } 
      else if (actionType === "Shortage") {
        result = await updateShortage(selectedItem.importId, staffId, details);
      }
  
      if (result?.status) {
        toast.success(`${actionType} update: ${result.data}`);
      } else {
        toast.error(result?.message || "Update failed");
      }
      
      refreshData();
    } catch (error: any) {
      console.error("API error:", error);
  
      // Xử lý lỗi API trả về status 400
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || "Lỗi xảy ra!";
  
        if (statusCode === 400) {
          toast.error(errorMessage);
        } else {
          toast.error("Lỗi từ server: " + errorMessage);
        }
      } else {
        toast.error("Lỗi kết nối đến server");
      }
    } finally {
      setOpenDialog(false);
    }
  };
  

  // Nếu không có dữ liệu và không loading, hiển thị EmptyState
  if (!loading && items.length === 0) {
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <EmptyState loading={false} />
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <TableSortLabel
                  active={sortBy === "importStoreId"}
                  direction={sortBy === "importStoreId" ? (isDescending ? "desc" : "asc") : "asc"}
                  onClick={createSortHandler("importStoreId")}
                >
                  Import Store ID
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortBy === "wareHouseName"}
                  direction={sortBy === "wareHouseName" ? (isDescending ? "desc" : "asc") : "asc"}
                  onClick={createSortHandler("wareHouseName")}
                >
                  Warehouse Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortBy === "allocatedQuantity"}
                  direction={sortBy === "allocatedQuantity" ? (isDescending ? "desc" : "asc") : "asc"}
                  onClick={createSortHandler("allocatedQuantity")}
                >
                  Allocated Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? (isDescending ? "desc" : "asc") : "asc"}
                  onClick={createSortHandler("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Comments</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.importStoreId}>
                <TableCell align="center">{item.importStoreId}</TableCell>
                <TableCell align="center">{item.wareHouseName}</TableCell>
                <TableCell align="center">{item.allocatedQuantity}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">{item.comments}</TableCell>
                <TableCell align="center">
                  {item.status.trim() === "Processing" ? (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenDialog(item, "FullStock")}
                      >
                        Full Stock
                      </Button>
                    
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => handleOpenDialog(item, "Shortage")}
                      >
                        Shortage
                      </Button>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.5,
                        color: "text.disabled",
                        cursor: "default",
                      }}
                    >
                      No Action
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CommentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmitComment}
        actionType={actionType}
      />
    </>
  );
};

export default StaffImportRequestTable;
