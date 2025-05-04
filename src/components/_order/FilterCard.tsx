import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Collapse,
} from "@mui/material";
import { FilterList as FilterListIcon } from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GetReturnRequestsParams } from "@/type/returnrequest";

interface FilterCardProps {
    filters: GetReturnRequestsParams;
    fromDate: Date | null;
    toDate: Date | null;
    status: string;
    option: string;
    orderId: string;
    open: boolean;
    onToggle: () => void;
    onChange: (key: any, value: any) => void;
    onReset: () => void;
  }
  
  const FilterCard: React.FC<FilterCardProps> = ({ filters, fromDate, toDate, status, option, orderId, open, onToggle, onChange, onReset }) => (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
      <CardHeader
        avatar={<IconButton onClick={onToggle}><FilterListIcon /></IconButton>}
        title={<Typography sx={{ fontWeight: 500 }}>Bộ lọc nâng cao</Typography>}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Mã đơn hàng" size="small" value={orderId} onChange={e => onChange('orderId', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select value={status} label="Trạng thái" onChange={e => onChange('status', e.target.value)}>
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Pending Processing">Chờ xử lý</MenuItem>
                  <MenuItem value="Processed">Đã xử lý</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Tuỳ chọn</InputLabel>
                <Select value={option} label="Tuỳ chọn" onChange={e => onChange('option', e.target.value)}>
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Hoàn tiền">Hoàn tiền</MenuItem>
                  <MenuItem value="Đổi hàng">Đổi hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <ReactDatePicker selected={fromDate} onChange={date => onChange('fromDate', date)} placeholderText="Từ ngày" dateFormat="dd/MM/yyyy" isClearable />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <ReactDatePicker selected={toDate} onChange={date => onChange('toDate', date)} placeholderText="Đến ngày" dateFormat="dd/MM/yyyy" isClearable />
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button fullWidth variant="contained" onClick={onReset} sx={{ textTransform: 'none', borderRadius: 2 }}>Làm mới</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
  
  export default FilterCard;
  