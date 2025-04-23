"use client";

import React, { useEffect, useState } from "react";
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
import {
  FiShoppingCart,
  FiCheckCircle,
  FiTruck,
  FiRotateCcw,
} from "react-icons/fi";

const stats = [
  { title: "Orders to Confirm", value: "15", icon: <FiShoppingCart size={20} />, color: "primary" },
  { title: "Packing Pending", value: "8", icon: <FiCheckCircle size={20} />, color: "secondary" },
  { title: "Deliveries", value: "5", icon: <FiTruck size={20} />, color: "success" },
  { title: "Return Requests", value: "3", icon: <FiRotateCcw size={20} />, color: "error" },
];

const DashboardStaffClient = () => {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const account = JSON.parse(localStorage.getItem("account") || "{}");
    setFullName(account.fullName || "Staff");
  }, []);


  return (
    <DashboardLayoutStaff>
      <Box sx={{ p: 3 }}>
        {/* Welcome Message */}
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          👋 Welcome back, {fullName}!
        </Typography>

        {/* Stats Section */}
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <Box
                  sx={{
                    bgcolor: `${stat.color}.light`,
                    color: `${stat.color}.dark`,
                    p: 1.5,
                    borderRadius: "50%",
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {stat.icon}
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1">{stat.title}</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        
      </Box>
    </DashboardLayoutStaff>
  );
};

export default DashboardStaffClient;

/** Component Helpers */
const Section = ({
  title,
  description,
  placeholder,
}: {
  title: string;
  description: string;
  placeholder: string;
}) => (
  <Grid container spacing={3} sx={{ mt: 3 }}>
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Box sx={{ border: "1px dashed #ccc", p: 2, borderRadius: 1 }}>
            <Typography>{placeholder}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

const SectionForm = ({
  title,
  description,
  fields,
  buttonText,
}: {
  title: string;
  description: string;
  fields: { label: string; multiline?: boolean }[];
  buttonText: string;
}) => (
  <Grid item xs={12} md={6}>
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {fields.map((field, i) => (
            <TextField
              key={i}
              label={field.label}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              multiline={field.multiline}
              rows={field.multiline ? 3 : 1}
            />
          ))}
          <Button variant="contained" color="primary">
            {buttonText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Grid>
);
