import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, InputBase, Badge, Avatar, Menu, MenuItem, Paper } from "@mui/material";
import { FiSearch, FiBell } from "react-icons/fi";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={isScrolled ? 4 : 1}
      sx={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderRadius: "0 0 12px 12px",
        px: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo or Title */}
        <div style={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}>Dashboard</div>

        {/* Search Input */}
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 0.5,
            borderRadius: "8px",
            boxShadow: "none",
            bgcolor: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <IconButton size="small">
            <FiSearch />
          </IconButton>
          <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
        </Paper>

        {/* Icons and User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <FiBell />
            </Badge>
          </IconButton>

          {/* User Avatar & Dropdown */}
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              src="/assets/ava1.avif"
              alt="User Avatar"
              sx={{ width: 40, height: 40 }}
            />
          </IconButton>

          {/* Menu Dropdown */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
