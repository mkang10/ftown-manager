"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

// Các tùy chọn khoảng thời gian
const timeRangeOptions = [
  { label: "Tùy chọn", value: "" },
  { label: "Hôm qua", value: "yesterday" },
  { label: "Tuần trước", value: "lastWeek" },
  { label: "Tháng trước", value: "lastMonth" },
  { label: "3 tháng trước", value: "last3Months" },
  { label: "6 tháng trước", value: "last6Months" },
  { label: "1 năm trước", value: "lastYear" },
];

export interface FilterData {
  Status?: string;
  ReferenceNumber?: string;
  FromDate?: string;
  ToDate?: string;
  SortBy?: string;
  IsDescending?: boolean;
  Page?: number;
  PageSize?: number;
  HandleBy?: string;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters?: FilterData;
  showStatusFilter?: boolean;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialFilters = {},
  showStatusFilter = true,
}) => {
  const defaultHandleBy = useMemo(() => {
    try {
      const acc = localStorage.getItem('account');
      return acc ? JSON.parse(acc).roleDetails?.shopManagerDetailId : '';
    } catch {
      return '';
    }
  }, []);

  const [status, setStatus] = useState<string>(initialFilters.Status || '');
  const [refNum, setRefNum] = useState<string>(initialFilters.ReferenceNumber || '');
  const [fromDate, setFromDate] = useState<string>(initialFilters.FromDate || '');
  const [toDate, setToDate] = useState<string>(initialFilters.ToDate || '');
  const [range, setRange] = useState<string>('');

  useEffect(() => {
    if (open) {
      setStatus(initialFilters.Status || '');
      setRefNum(initialFilters.ReferenceNumber || '');
      setFromDate(initialFilters.FromDate || '');
      setToDate(initialFilters.ToDate || '');
      setRange('');
    }
  }, [open, initialFilters]);

  const formatLocal = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleRange = (value: string) => {
    setRange(value);
    const now = new Date();
    switch(value) {
      case 'yesterday': {
        const d = new Date(now);
        d.setDate(now.getDate()-1);
        setFromDate(formatLocal(new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0)));
        setToDate(formatLocal(new Date(d.getFullYear(),d.getMonth(),d.getDate(),23,59)));
        break;
      }
      case 'lastWeek':
      case 'lastMonth':
      case 'last3Months':
      case 'last6Months':
      case 'lastYear': {
        const daysMap: Record<string, number> = { lastWeek:7, lastMonth:30, last3Months:90, last6Months:180, lastYear:365 };
        const d = new Date(now);
        d.setDate(now.getDate() - (daysMap[value] || 0));
        setFromDate(formatLocal(d));
        setToDate(formatLocal(now));
        break;
      }
      default:
        setFromDate('');
        setToDate('');
    }
  };

  const handleApply = () => {
    const data: FilterData = {
      Status: status,
      ReferenceNumber: refNum,
      FromDate: fromDate,
      ToDate: toDate,
      SortBy: initialFilters.SortBy || 'ImportId',
      IsDescending: initialFilters.IsDescending ?? false,
      Page: initialFilters.Page || 1,
      PageSize: initialFilters.PageSize || 10,
      HandleBy: defaultHandleBy,
    };
    Object.keys(data).forEach(k => !data[k as keyof FilterData] && delete data[k as keyof FilterData]);
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#000', color: '#fff' }}>
        Bộ lọc phiếu nhập
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: '#f9f9f9', pt: 3 }}>
        <Grid container spacing={2}>
          {showStatusFilter && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb:1, color:'#333' }}>Trạng thái</Typography>
              <TextField
                select
                fullWidth
                value={status}
                onChange={e => setStatus(e.target.value)}
                variant="outlined"
                size="small"
              >
                {['','Pending','Approved','Rejected','Processing','Done'].map(s => (
                  <MenuItem key={s} value={s}>{s || 'Tất cả'}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb:1, color:'#333' }}>Khoảng thời gian</Typography>
            <TextField
              select
              fullWidth
              value={range}
              onChange={e => handleRange(e.target.value)}
              variant="outlined"
              size="small"
            >
              {timeRangeOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb:1, color:'#333' }}>Từ ngày</Typography>
            <TextField
              type="datetime-local"
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb:1, color:'#333' }}>Đến ngày</Typography>
            <TextField
              type="datetime-local"
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" sx={{ mb:1, color:'#333' }}>Số tham chiếu</Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Nhập mã tham chiếu"
              value={refNum}
              onChange={e => setRefNum(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p:2, backgroundColor:'#fff' }}>
        <Box sx={{ flex: 1, ml:2 }}>
          <Button onClick={() => { setStatus(''); setRefNum(''); setFromDate(''); setToDate(''); setRange(''); }}
            sx={{ textTransform:'none', color:'#000' }}>
            Xóa hết
          </Button>
        </Box>
        <Button onClick={onClose} sx={{ textTransform:'none', color:'#000' }}>Hủy</Button>
        <Button onClick={handleApply} variant="contained" sx={{ textTransform:'none', backgroundColor:'#000', color:'#fff', '&:hover':{backgroundColor:'#333'} }}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
