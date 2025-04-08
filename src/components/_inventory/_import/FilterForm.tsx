"use client";
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

// Các tùy chọn khoảng thời gian
const timeRangeOptions = [
  { label: "Custom", value: "" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last Week", value: "lastWeek" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 3 Months", value: "last3Months" },
  { label: "Last 6 Months", value: "last6Months" },
  { label: "Last Year", value: "lastYear" },
];

export interface FilterData {
  [key: string]: any;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters?: FilterData;
  showStatusFilter?: boolean; // Thêm prop này để điều khiển hiển thị filter Status
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialFilters = {},
  showStatusFilter = true, // Mặc định hiển thị
}) => {
  // Lấy HandleBy mặc định từ localStorage (nếu cần)
  const defaultHandleBy = useMemo(() => {
    if (typeof window !== "undefined") {
      const storedAccount = localStorage.getItem("account");
      if (storedAccount) {
        try {
          const account = JSON.parse(storedAccount);
          return account.roleDetails?.shopManagerDetailId || "";
        } catch (error) {
          console.error("Error parsing account:", error);
          return "";
        }
      }
    }
    return "";
  }, []);

  // Trạng thái cho các trường filter
  const [status, setStatus] = useState(initialFilters.Status || "");
  const [referenceNumber, setReferenceNumber] = useState(initialFilters.ReferenceNumber || "");
  const [fromDate, setFromDate] = useState(initialFilters.FromDate || "");
  const [toDate, setToDate] = useState(initialFilters.ToDate || "");
  const [selectedTimeRange, setSelectedTimeRange] = useState("");

  // Hàm định dạng date theo chuẩn datetime-local (yyyy-MM-ddTHH:mm)
  const formatDateTimeLocal = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Cập nhật fromDate và toDate dựa trên lựa chọn dropdown
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setSelectedTimeRange(selected);

    const now = new Date();

    let newFromDate = "";
    let newToDate = "";

    switch (selected) {
      case "yesterday": {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        newFromDate = formatDateTimeLocal(new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0));
        newToDate = formatDateTimeLocal(new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59));
        break;
      }
      case "lastWeek": {
        const pastWeek = new Date(now);
        pastWeek.setDate(now.getDate() - 7);
        newFromDate = formatDateTimeLocal(pastWeek);
        newToDate = formatDateTimeLocal(now);
        break;
      }
      case "lastMonth": {
        const pastMonth = new Date(now);
        pastMonth.setDate(now.getDate() - 30);
        newFromDate = formatDateTimeLocal(pastMonth);
        newToDate = formatDateTimeLocal(now);
        break;
      }
      case "last3Months": {
        const past3Months = new Date(now);
        past3Months.setDate(now.getDate() - 90);
        newFromDate = formatDateTimeLocal(past3Months);
        newToDate = formatDateTimeLocal(now);
        break;
      }
      case "last6Months": {
        const past6Months = new Date(now);
        past6Months.setDate(now.getDate() - 180);
        newFromDate = formatDateTimeLocal(past6Months);
        newToDate = formatDateTimeLocal(now);
        break;
      }
      case "lastYear": {
        const pastYear = new Date(now);
        pastYear.setDate(now.getDate() - 365);
        newFromDate = formatDateTimeLocal(pastYear);
        newToDate = formatDateTimeLocal(now);
        break;
      }
      default: {
        newFromDate = "";
        newToDate = "";
      }
    }
    setFromDate(newFromDate);
    setToDate(newToDate);
  };

  const handleApply = () => {
    const filters: FilterData = {
      Status: status,
      ReferenceNumber: referenceNumber,
      FromDate: fromDate,
      ToDate: toDate,
      SortBy: "ImportId",
      IsDescending: false,
      Page: 1,
      PageSize: initialFilters.PageSize || 10,
      HandleBy: defaultHandleBy,
    };

    // Loại bỏ các trường rỗng
    Object.keys(filters).forEach((key) => {
      if (filters[key] === "" || filters[key] === null) {
        delete filters[key];
      }
    });

    onSubmit(filters);
    onClose();
  };

  const handleClear = () => {
    setStatus("");
    setReferenceNumber("");
    setFromDate("");
    setToDate("");
    setSelectedTimeRange("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Filter Inventory Imports</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Chỉ render trường Status nếu showStatusFilter = true */}
          {showStatusFilter && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </TextField>
            </Grid>
          )}
          {/* Dropdown cho Time Range */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Time Range"
              fullWidth
              value={selectedTimeRange}
              onChange={handleTimeRangeChange}
            >
              {timeRangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Trường From Date */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="From Date"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>
          {/* Trường To Date */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="To Date"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>
          {/* Trường Reference Number */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Reference Number"
              fullWidth
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
