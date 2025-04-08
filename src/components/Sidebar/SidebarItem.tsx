import React from "react";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface SidebarItemProps {
  icon: React.ReactElement<IconType>;
  label: string;
  isOpen: boolean;
  route: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isOpen, route }) => {
  const router = useRouter();

  return (
    <ListItemButton onClick={() => router.push(route)} sx={{ borderRadius: 2 }}>
      <ListItemIcon>{icon}</ListItemIcon>
      {isOpen && <ListItemText primary={label} />}
    </ListItemButton>
  );
};

export default SidebarItem;
