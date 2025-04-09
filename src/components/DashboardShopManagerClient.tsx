// components/DashboardShopManagerClient.tsx
"use client";
import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import { FiBox, FiShoppingCart, FiClipboard, FiTrendingUp } from "react-icons/fi";
import OrdersTable from "@/components/OrderTable";
import TopEmployees from "@/components/TopEmployee";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

const barChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      label: "Revenue",
      data: [1500, 2500, 1800, 3000, 3200, 2700],
      backgroundColor: "#4ade80",
    },
  ],
};

const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    {
      label: "Order Processing Time (mins)",
      data: [30, 28, 32, 26, 29, 31, 27, 25],
      borderColor: "#60a5fa",
      backgroundColor: "rgba(96,165,250,0.2)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const chartOptions = { responsive: true, maintainAspectRatio: false };

const stats = [
  { title: "Products", value: "1,200", icon: <FiBox />, color: "primary" },
  { title: "Pending Orders", value: "27", icon: <FiShoppingCart />, color: "secondary" },
  { title: "Inventory", value: "5,600", icon: <FiClipboard />, color: "success" },
  { title: "Promotions", value: "3", icon: <FiTrendingUp />, color: "error" },
];

const DashboardShopManagerClient: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Row 1: Thẻ thống kê */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <Box sx={{ bgcolor: stat.color + ".light", p: 1.5, borderRadius: "50%" }}>
                {stat.icon}
              </Box>
              <CardContent>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Row 2: Biểu đồ doanh số & thời gian xử lý đơn hàng */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Revenue</Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={barChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order Processing Time</Typography>
              <Box sx={{ height: 300 }}>
                <Line data={lineChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Bảng đơn hàng */}
      <Box sx={{ mt: 3 }}>
        <OrdersTable />
      </Box>

      {/* Row 4: Top Employees */}
      <Box sx={{ mt: 3 }}>
        <TopEmployees />
      </Box>
    </Box>
  );
};

export default DashboardShopManagerClient;
