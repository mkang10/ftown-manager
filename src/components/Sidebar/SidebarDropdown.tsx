import React from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";

export interface SubItem {
  label: string;
  route: string;
}

interface SidebarDropdownProps {
  id: string;
  icon: React.ReactElement<IconType>;
  label: string;
  isOpen: boolean;
  subItems: SubItem[];
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  id,
  icon,
  label,
  isOpen,
  subItems,
  activeDropdown,
  setActiveDropdown,
}) => {
  const router = useRouter();
  const open = activeDropdown === id;

  return (
    <List sx={{ width: "100%" }}>
      <ListItemButton onClick={() => setActiveDropdown(open ? null : id)} sx={{ borderRadius: 2 }}>
        <ListItemIcon>{icon}</ListItemIcon>
        {isOpen && <ListItemText primary={label} />}
        {isOpen && <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />}
      </ListItemButton>

      <Collapse in={open && isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          {subItems.map((sub, idx) => (
            <ListItemButton key={idx} onClick={() => router.push(sub.route)} sx={{ borderRadius: 2 }}>
              <ListItemText primary={sub.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  );
};

export default SidebarDropdown;
