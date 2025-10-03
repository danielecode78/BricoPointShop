import apiClient from "../utils/apiClient";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Autocomplete,
  TextField,
  Badge,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { styled, alpha } from "@mui/material/styles";
import { Menu } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import AccountMenu from "./AccountMenu";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1.4),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function Navbar({ onMenuClick }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const timer = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  const pageSelect = (path) => {
    navigate(path);
  };
  const logout = async () => {
    await apiClient.post("/logout");
    setUser(null);
    toast.success("Logout effettuato con successo!");
  };

  const askToDatabase = (inputValue) => {
    if (inputValue.length > 3) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const fetchProducts = async () => {
          try {
            const res = await apiClient.get("/products", {
              params: { search: inputValue },
            });
            setProducts(res.data);
          } catch (err) {
            const dataError = err.response?.data;
            if (dataError?.statusCode === 500) {
              toast.danger("Ricerca non trovata!");
            }
            console.log("Status code:", dataError?.statusCode);
            console.log("Messaggio:", dataError?.message);
            console.log("Stack:", dataError?.stack);
          }
        };
        fetchProducts();
      }, 300);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              width: "100%",
              mt: { xs: 0.8, sm: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                gap: 1,
              }}
            >
              <IconButton
                size="large"
                edge="false"
                color="inherit"
                aria-label="menu"
                onClick={onMenuClick}
                sx={{ pl: 0.5 }}
              >
                <Menu />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  width: "100%",
                  flexGrow: 1,
                }}
              >
                <Box
                  component="img"
                  src={"/title2.png"}
                  alt="Logo"
                  onClick={() => pageSelect("/")}
                  sx={{
                    maxHeight: "40px",
                    height: "auto",
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "block",
                  }}
                />
              </Box>
              {user?.role === "admin" && (
                <>
                  <IconButton
                    aria-label="add product"
                    sx={{ p: 0 }}
                    onClick={() => pageSelect("/add")}
                  >
                    <AddIcon
                      sx={{ color: "white", height: "35px", width: "auto" }}
                    />
                  </IconButton>
                </>
              )}
              {user && <AccountMenu />}
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                mb: { xs: 2, sm: 0 },
                gap: 1,
              }}
            >
              <Search
                sx={{
                  flexGrow: 1,
                  maxWidth: "800px",
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <Autocomplete
                  key={resetKey}
                  sx={{
                    pl: 6,
                    width: "100%",
                    "& .MuiInputBase-root": {
                      height: "40px",
                      padding: 0,
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      padding: "0 8px",
                      height: "40px",
                      lineHeight: "40px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        border: "none",
                        lineHeight: "40px",
                      },
                  }}
                  onInputChange={(event, inputValue) => {
                    askToDatabase(inputValue);
                  }}
                  onChange={(e, choice) => {
                    if (choice) {
                      navigate(`/${choice._id}`);
                      setResetKey((prev) => prev + 1);
                      setProducts([]);
                    }
                  }}
                  freeSolo={false}
                  id="searchInput"
                  disableClearable
                  options={products}
                  filterOptions={(options, state) => {
                    const input = state.inputValue.toLowerCase();
                    return options.filter((opt) =>
                      `${opt.name} ${opt.description} ${opt.brand}`
                        .toLowerCase()
                        .includes(input)
                    );
                  }}
                  getOptionLabel={(option) =>
                    `${option.name} - ${option.brand}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Ricerca prodotto"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          type: "search",
                        },
                      }}
                    />
                  )}
                />
              </Search>
              {user?.role === "user" && (
                <>
                  {user?.cart.length > 0 ? (
                    <IconButton
                      aria-label="account"
                      sx={{ p: 0 }}
                      onClick={() => pageSelect("/cart")}
                    >
                      <Badge
                        badgeContent={user?.cart.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}
                        color="error"
                      >
                        <ShoppingCartIcon
                          sx={{ color: "white", height: "35px", width: "auto" }}
                        />
                      </Badge>
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="account"
                      sx={{ p: 0 }}
                      onClick={() =>
                        toast.error("Aggiungi un articolo al carrello")
                      }
                    >
                      <Badge
                        badgeContent={user?.cart.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}
                        color="error"
                      >
                        <ShoppingCartIcon
                          sx={{ color: "white", height: "35px", width: "auto" }}
                        />
                      </Badge>
                    </IconButton>
                  )}
                </>
              )}
              <IconButton aria-label="account" sx={{ p: 0 }}>
                {user ? (
                  <LogoutIcon
                    onClick={logout}
                    sx={{ color: "white", height: "35px", width: "auto" }}
                  />
                ) : (
                  <LoginIcon
                    onClick={() => pageSelect("/login")}
                    sx={{ color: "white", height: "35px", width: "auto" }}
                  />
                )}
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
