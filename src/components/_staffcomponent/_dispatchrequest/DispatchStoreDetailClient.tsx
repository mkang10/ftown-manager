"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Tooltip,
  Divider,
  Stack,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  DispatchStoreDetail,
  DispatchStoreDetailResponse,
} from "@/type/dispatchStoreDetail";
import DispatchStoreDetailTable from "@/components/_staffcomponent/_dispatchrequest/DispatchStoreDetailTable";
import DispatchStoreDetailPagination from "@/components/_staffcomponent/_dispatchrequest/DispatchStoreDetailPagination";
import DispatchStoreDetailFilterDialog, {
  FilterData,
} from "@/components/_staffcomponent/_dispatchrequest/DispatchStoreDetailFilterDialog";
import {
  filterDispatchStoreDetails,
  updateFullStockDispatch,
} from "@/ultis/dispatch";
import CommentDialog from "@/components/_staffcomponent/_importreuquest/CommentDialog";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#f9f9f9", paper: "#ffffff" },
    text: { primary: "#000000", secondary: "#444444" },
    primary: { main: "#000000" },
    contrastThreshold: 4.5,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h5: { fontWeight: 700, letterSpacing: 0.5, color: "#000000" },
    body1: { fontSize: "1rem", color: "#111111" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "1px solid #000000",
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "0px solid #000000",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#000000",
          color: "#ffffff",
          transition: "all 0.3s ease",
          '&:hover': {
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "2px solid #000000",
          },
        },
        outlinedPrimary: {
          borderColor: "#000000",
          color: "#000000",
          '&:hover': {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#000000",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "0.5rem 0",
          backgroundColor: "#000000",
          height: 2,
        },
      },
    },
  },
});

//... rest of the code remains unchanged
const DispatchStoreDetailClient: React.FC = () => {
  const staffDetailId = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const acct = JSON.parse(localStorage.getItem("account") || "{}");
      return acct.roleDetails?.staffDetailId?.toString() || "";
    } catch {
      return "";
    }
  }, []);

  const [data, setData] = useState<DispatchStoreDetail[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<FilterData>({
    DispatchDetailId: "",
    WarehouseId: "",
    StaffDetailId: staffDetailId,
    HandleBy: "",
    Status: "",
    Comments: "",
    SortBy: "",
    IsDescending: false,
    Page: "1",
    PageSize: "10",
  });
  const [sortField, setSortField] = useState("dispatchStoreDetailId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"FullStock" | "Shortage">("FullStock");
  const [selectedItem, setSelectedItem] = useState<DispatchStoreDetail | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const applied = {
        ...filters,
        SortBy: sortField,
        IsDescending: sortDirection === "desc",
        StaffDetailId: staffDetailId,
        Page: page.toString(),
        PageSize: pageSize.toString(),
      };
      const res: DispatchStoreDetailResponse = await filterDispatchStoreDetails(
        page,
        pageSize,
        applied
      );
      setData(res.data || []);
      setTotalRecords(res.totalRecords || 0);
    } catch {
      toast.error("Không tải được dữ liệu.");
    }
  }, [filters, page, pageSize, sortField, sortDirection, staffDetailId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (_: any, newPage: number) => setPage(newPage);
  const handleFilterSubmit = (applied: FilterData) => {
    setFilters({
      ...applied,
      StaffDetailId: staffDetailId,
      Page: "1",
      PageSize: pageSize.toString(),
    });
    setPage(1);
    setFilterDialogOpen(false);
  };
  const handleSortChange = (field: string) => {
    const dir = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(dir);
    setPage(1);
  };
  const handleDone = (id: number, type: "FullStock" | "Shortage") => {
    const it = data.find((d) => d.dispatchStoreDetailId === id);
    if (!it) return toast.error("Không tìm thấy mục.");
    setSelectedItem(it);
    setActionType(type);
    setIsCommentDialogOpen(true);
  };
  const handleSubmitComment = async (comment: string, actualQty: number) => {
    if (!selectedItem) return;
    try {
      const result = await updateFullStockDispatch(
        selectedItem.dispatchId!,
        +staffDetailId,
        [
          {
            storeDetailId: selectedItem.dispatchStoreDetailId,
            actualReceivedQuantity:
              actionType === "FullStock"
                ? selectedItem.allocatedQuantity
                : actualQty,
            comment,
          },
        ]
      );
      result?.status
        ? toast.success("Cập nhật thành công")
        : toast.error(result?.message || "Thất bại");
      fetchData();
    } catch {
      toast.error("Lỗi server.");
    }
    setIsCommentDialogOpen(false);
    setSelectedItem(null);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ mb: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderBottom: "1px solid #ddd" }}>
          <Inventory2Icon fontSize="medium" sx={{ mr: 1 }} />
          <Typography variant="h5">Chi tiết Xuất Kho</Typography>
        </Box>

        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Tooltip title="Mở bộ lọc">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Lọc dữ liệu
            </Button>
          </Tooltip>
          <Typography variant="body2" color="text.secondary">
            Tổng cộng: <Typography component="span" fontWeight={600}>{totalRecords}</Typography> bản ghi
          </Typography>
        </Box>

        <Box sx={{ px: 3, pt: 2, backgroundColor: "#ffffff" }}>
          {data.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Card>
              <CardContent sx={{ padding: 0 }}>
                <DispatchStoreDetailTable
                  data={data}
                  onSortChange={handleSortChange}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onFullStock={(id) => handleDone(id, "FullStock")}
                  onAssign={(id) => toast.success(`Phân công #${id}`)}
                />
              </CardContent>
            </Card>
          )}
        </Box>

        <Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "center", backgroundColor: "#f5f5f5" }}>
          <DispatchStoreDetailPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </Box>

        <DispatchStoreDetailFilterDialog
          open={filterDialogOpen}
          onClose={() => setFilterDialogOpen(false)}
          onSubmit={handleFilterSubmit}
          initialFilters={filters}
        />
        <CommentDialog
          open={isCommentDialogOpen}
          onClose={() => setIsCommentDialogOpen(false)}
          onSubmit={handleSubmitComment}
          actionType={actionType}
        />
        <ToastContainer position="top-right" autoClose={3000} />
      </Paper>
    </ThemeProvider>
  );
};

export default DispatchStoreDetailClient;
