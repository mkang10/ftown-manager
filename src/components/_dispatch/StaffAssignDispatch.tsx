"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { GetStaffNamesResponse, StaffName } from "@/type/Staff";
import { assignDispatchStaffDetail, getStaffNames } from "@/ultis/AssignAPI";

interface StaffAssignDialogProps {
  open: boolean;
  dispatchId: number;
  onClose: () => void;
  onAssigned: () => void;
}

const StaffAssignDispatch: React.FC<StaffAssignDialogProps> = ({
  open,
  dispatchId,
  onClose,
  onAssigned,
}) => {
  const [staffOptions, setStaffOptions] = useState<StaffName[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffName | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getStaffNames()
        .then((res: GetStaffNamesResponse) => {
          if (res.status) setStaffOptions(res.data);
        })
        .catch((err) => console.error("Error fetching staff:", err))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!selectedStaff) {
      alert("Vui lòng chọn nhân viên!");
      return;
    }
    try {
      const res = await assignDispatchStaffDetail(
        dispatchId,
        selectedStaff.id
      );
      if (res.status) onAssigned();
      else console.error("Assign failed:", res.message);
    } catch (err) {
      console.error("Error assigning staff:", err);
    } finally {
      onClose();
      setSelectedStaff(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      {/* Header: đen - chữ trắng */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: "#000",
          color: "#fff",
          fontWeight: 600,
          fontSize: "1.25rem",
        }}
      >
        {/* <Avatar
          src={selectedStaff?.avatarUrl || "/avatar-placeholder.png"}
          alt={selectedStaff?.fullName || "Nhân viên"}
          sx={{ width: 40, height: 40 }}
        /> */}
       
        
        <Typography variant="h6" sx={{ m: 0 }}>
          Chọn nhân viên
        </Typography>
      </DialogTitle>
      <Divider sx={{ borderColor: '#e0e0e0' }} />

      {/* Content: trắng hoặc xám nhạt */}
      <DialogContent sx={{ pt: 4, pb: 3, px: 3, backgroundColor: "#fff" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Autocomplete
            options={staffOptions}
            getOptionLabel={(opt) => opt.fullName}
            value={selectedStaff}
            onChange={(e, val) => setSelectedStaff(val)}
            sx={{
              mt: 2,
              '& .MuiAutocomplete-paper': {
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 2,
              },
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1,
                  py: 0.5,
                  '&:hover': { backgroundColor: '#f9f9f9' }
                }}
                {...props}
              >
                {/* <Avatar
                  src={option.avatarUrl || "/avatar-placeholder.png"}
                  alt={option.fullName}
                  sx={{ width: 32, height: 32 }}
                /> */}
                <Avatar
                  src={option.fullName || "/avatar-placeholder.png"}
                  alt={option.fullName}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                  {option.fullName}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tìm hoặc chọn nhân viên"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  }
                }}
              />
            )}
          />
        )}
      </DialogContent>

      {/* Actions: trắng - nút chính đen */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "#fff",
          borderTop: "1px solid #e0e0e0",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            color: "#000",
            borderColor: "#000",
            px: 3,
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            backgroundColor: "#000",
            color: "#fff",
            px: 3,
            '&:hover': { backgroundColor: '#222' },
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffAssignDispatch;