import axios from "axios";
axios.defaults.withCredentials = true;
import { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Grow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [subMenu, setSubMenu] = useState(false);
  const itemStyle = {
    cursor: "pointer",
  };
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      });
  }, []);

  return (
    <>
      <Drawer
        anchor={isXs ? "top" : "left"}
        open={open}
        onClose={onClose}
        variant="temporary"
        sx={{ "& .MuiDrawer-paper": { width: "320px" } }}
        TransitionComponent={Grow}
        transitionDuration={500}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component="img"
            src={"/title2.png"}
            alt="Logo"
            sx={{
              height: 40,
              borderRadius: "5px",
            }}
          />

          <IconButton
            onClick={onClose}
            sx={{ marginTop: "7px", marginRight: "7px" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {categories.map((el) => (
            <ListItem
              button="true"
              key={el._id}
              onClick={() => {
                setSelectedCategory(el);
                setSubMenu(true);
              }}
            >
              <ListItemText primary={el.name} sx={itemStyle} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Drawer
        anchor={isXs ? "top" : "left"}
        variant="temporary"
        open={subMenu}
        onClose={() => setSubMenu(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "320px",
            left: isXs ? "0px" : "320px",
          },
        }}
        TransitionComponent={Grow}
        transitionDuration={500}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component="img"
            src={"/title2.png"}
            alt="Logo"
            sx={{
              height: 40,
              borderRadius: "5px",
            }}
          />

          <IconButton
            onClick={() => setSubMenu(false)}
            sx={{ marginTop: "7px", marginRight: "7px" }}
          >
            <BackIcon />
          </IconButton>
        </Box>

        <List>
          {selectedCategory?.subcategories?.map((el) => (
            <ListItem
              button="true"
              key={el._id}
              onClick={() => {
                setSubMenu(false);
                onClose();
                navigate(`/?subcategory=${encodeURIComponent(el.name)}`);
              }}
            >
              <ListItemText primary={el.name} sx={itemStyle} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
