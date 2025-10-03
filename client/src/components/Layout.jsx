import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Navbar onMenuClick={toggleMenu} />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Sidebar open={openMenu} onClose={toggleMenu} />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </>
  );
}
