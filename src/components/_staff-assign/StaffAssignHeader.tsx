'use client';
import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import Button from '@mui/material/Button';

interface StaffAssignHeaderProps {
  onOpenFilter: () => void;
}

const HeaderContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid #000',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const StyledButton = styled(Button)(() => ({
  borderColor: '#000',
  color: '#000',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#000',
    color: '#fff',
  },
}));

const StaffAssignHeader: React.FC<StaffAssignHeaderProps> = ({ onOpenFilter }) => (
  <HeaderContainer>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h5" fontWeight="bold">
        Gán nhân viên – Phiếu nhập kho
      </Typography>
      <Box display="flex" gap={2}>
        <StyledButton variant="outlined" onClick={onOpenFilter}>
          Lọc
        </StyledButton>
      </Box>
    </Box>
  </HeaderContainer>
);

export default StaffAssignHeader;
