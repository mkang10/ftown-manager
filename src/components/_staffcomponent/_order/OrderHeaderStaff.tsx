"use client";

import { Box, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

type Props = {
  onOpenFilter: () => void;
  onRefresh: () => void;
};

const OrderHeaderStaff: React.FC<Props> = ({ onOpenFilter, onRefresh }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    }}
  >
    <Typography variant="h5" fontWeight={600}>
      Quản lý đơn hàng
    </Typography>
    <Box display="flex" gap={2}>
      <Button variant="outlined" startIcon={<FilterListIcon />} onClick={onOpenFilter}>
        Lọc
      </Button>
      <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRefresh}>
        Làm mới
      </Button>
    </Box>
  </Box>
);

export default OrderHeaderStaff;
