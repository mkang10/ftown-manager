import React from 'react';
import { Card, CardContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { AssignmentOrderFilters } from '@/type/order';

interface Props {
  filters: AssignmentOrderFilters;
  onChange: (filters: AssignmentOrderFilters) => void;
  onSearch: () => void;
}

const OrderFilter: React.FC<Props> = ({ filters, onChange, onSearch }) => {
  const handleFieldChange = (key: keyof AssignmentOrderFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Card sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Từ ngày giao việc"
              type="date"
              value={filters.assignmentDateFrom || ''}
              onChange={e => handleFieldChange('assignmentDateFrom', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Đến ngày giao việc"
              type="date"
              value={filters.assignmentDateTo || ''}
              onChange={e => handleFieldChange('assignmentDateTo', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filters.orderStatus || ''}
                label="Trạng thái"
                onChange={e => handleFieldChange('orderStatus', e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="PendingConfirmed">Pending Confirmed</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Tên khách chứa"
              value={filters.fullNameContains || ''}
              onChange={e => handleFieldChange('fullNameContains', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={onSearch}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderFilter;