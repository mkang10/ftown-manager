"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
} from "@mui/material";
import DashboardLayoutStaff from "@/layout/DashboardStaffLayout";
import { FiLogIn, FiLogOut, FiShoppingCart, FiCheckCircle, FiTruck, FiRotateCcw, FiMessageSquare, FiBarChart2, FiBox } from "react-icons/fi";

const stats = [
  { title: "Orders to Confirm", value: "15", icon: <FiShoppingCart />, color: "primary" },
  { title: "Packing Pending", value: "8", icon: <FiCheckCircle />, color: "secondary" },
  { title: "Deliveries", value: "5", icon: <FiTruck />, color: "success" },
  { title: "Return Requests", value: "3", icon: <FiRotateCcw />, color: "error" },
];

const StaffDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  const handleLogout = () => {
    // Xử lý đăng xuất (Logout)
    setLoggedIn(false);
    // Redirect hoặc xử lý sau khi đăng xuất...
  };

  const handleLogin = () => {
    // Xử lý đăng nhập (Login)
    setLoggedIn(true);
  };

  return (
    <DashboardLayoutStaff>
      <Box sx={{ p: 3 }}>
       

        {/* Row 1: Thống kê các chỉ số */}
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <Box sx={{ bgcolor: stat.color + ".light", p: 1.5, borderRadius: "50%" }}>
                  {stat.icon}
                </Box>
                <CardContent>
                  <Typography variant="h6">{stat.title}</Typography>
                  <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Row 2: Quản lý đơn hàng */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Customer Orders</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Nhận và xem đơn hàng của khách hàng, xác nhận đơn hàng.
                </Typography>
                {/* Giả lập bảng đơn hàng */}
                <Box sx={{ border: "1px dashed #ccc", p: 2, borderRadius: 1 }}>
                  <Typography>[Orders Table Component]</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Row 3: Đóng gói & Cập nhật trạng thái đơn hàng */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Packing & Order Status</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Đóng gói sản phẩm và cập nhật trạng thái đơn hàng.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField label="Order ID" variant="outlined" fullWidth sx={{ mb: 2 }} />
                  <TextField label="New Status" variant="outlined" fullWidth sx={{ mb: 2 }} />
                  <Button variant="contained" color="primary">Update Status</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Theo dõi đơn hàng giao bởi dịch vụ */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Track Delivery</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Theo dõi đơn hàng với dịch vụ giao hàng.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField label="Tracking Number" variant="outlined" fullWidth sx={{ mb: 2 }} />
                  <Button variant="contained" color="primary">Track</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Row 4: Xử lý yêu cầu trả hàng */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Return Requests</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Nhận yêu cầu trả hàng, tạo/chỉnh sửa/xoá tài liệu xử lý.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField label="Return Request ID" variant="outlined" fullWidth sx={{ mb: 2 }} />
                  <TextField label="Action Details" variant="outlined" fullWidth multiline rows={3} sx={{ mb: 2 }} />
                  <Button variant="contained" color="primary">Process Return</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Row 5: Phản hồi khách & Báo cáo thống kê */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Customer Feedback</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Phản hồi thông tin xử lý của khách hàng.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField label="Customer ID" variant="outlined" fullWidth sx={{ mb: 2 }} />
                  <TextField label="Feedback Message" variant="outlined" fullWidth multiline rows={3} sx={{ mb: 2 }} />
                  <Button variant="contained" color="primary">Submit Response</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Statistical Reports</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Tạo/chỉnh sửa/xoá báo cáo thống kê số lượng sản phẩm và gửi duyệt cho quản lý.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField label="Report Title" variant="outlined" fullWidth sx={{ mb: 2 }} />
                  <TextField label="Report Details" variant="outlined" fullWidth multiline rows={3} sx={{ mb: 2 }} />
                  <Button variant="contained" color="primary">Submit Report</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Row 6: Nhập hàng */}
        <Grid container spacing={3} sx={{ mt: 3, mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Goods Import</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Tạo/chỉnh sửa/xoá tài liệu nhập hàng vào cửa hàng.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField label="Document ID" variant="outlined" fullWidth sx={{ mb: 2 }} />
                  <TextField label="Import Details" variant="outlined" fullWidth multiline rows={3} sx={{ mb: 2 }} />
                  <Button variant="contained" color="primary">Submit Import Document</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayoutStaff>
  );
};

export default StaffDashboard;
