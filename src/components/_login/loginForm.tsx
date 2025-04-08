"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "@/ultis/AuthAPI";
import { LoginResponse } from "@/type/auth";

// MUI components
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [showLogo, setShowLogo] = useState(true);
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Tự động chuyển đổi giữa logo và chữ "Login" mỗi 2500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = { email, password };

    try {
      const response: LoginResponse = await loginUser(credentials);
      if (response.status) {
        // Lưu token và account vào localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("account", JSON.stringify(response.data.account));

        toast.success(response.message, { position: "top-right", autoClose: 3000 });
        setTimeout(() => {
          // Kiểm tra roleId
          if (response.data.account.roleId === 2) {
            router.push("/dashboard");
          } else if (response.data.account.roleId === 3) {
            router.push("/staff-dashboard");
          } else {
            // Trường hợp khác (nếu có) => Chuyển tới trang mặc định
            router.push("/");
          }
        }, 2000);
      } else {
        toast.error(response.message, { position: "top-right", autoClose: 3000 });
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, { position: "top-right", autoClose: 3000 });
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau!", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/assets/office.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay nền */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      />

      <Paper
        elevation={6}
        sx={{
          position: "relative",
          zIndex: 1,
          p: 4,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: 2,
        }}
      >
        {/* Container cố định cho logo và chữ "Login" */}
        <Box
          sx={{
            position: "relative",
            width: 75,
            height: 75,
            mb: 2,
            mx: "auto",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              transition: "opacity 1s ease-in-out",
              opacity: showLogo ? 1 : 0,
            }}
          >
            <Image src="/assets/logo.avif" alt="Logo" width={75} height={75} />
          </Box>
          {/* Chữ "Login" */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 1s ease-in-out",
              opacity: showLogo ? 0 : 1,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Login
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: "gray" }}>
          Sign in to continue
        </Typography>

        {/* Form đăng nhập */}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: <FaUser style={{ marginRight: "10px", color: "gray" }} />,
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <FaLock style={{ marginRight: "10px", color: "gray" }} />,
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
            }}
          >
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Typography
              component="a"
              href="/forgotpassword"
              sx={{ fontSize: "0.9rem", color: "blue", cursor: "pointer" }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "gray" } }}
          >
            Login
          </Button>
        </form>
      </Paper>

      <ToastContainer />
    </Box>
  );
}
