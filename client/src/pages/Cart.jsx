import axios from "axios";
axios.defaults.withCredentials = true;
import {
  Typography,
  Grid,
  Card,
  IconButton,
  Box,
  CardMedia,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Cart() {
  const [userCart, setUserCart] = useState([]);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:3000/cart");
        setUserCart(res.data);
      } catch (err) {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      }
    };

    fetchCart();
  }, []);

  return (
    <>
      {userCart && (
        <Grid container spacing={2} columns={12}>
          {userCart.map((product, index) => (
            <Grid key={product._id} size={{ xs: 12, lg: 6 }}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 3,
                  position: "relative",
                  pt: { xs: 2, sm: 0 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "20vw",
                      height: "20vw",
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "fit",
                    }}
                    image={
                      product.productId.images.length > 0
                        ? product.productId.images[0].url
                        : "https://res.cloudinary.com/ds0kjkr1o/image/upload/v1756281555/samples/food/pot-mussels.jpg"
                    }
                    alt="immagine del prodotto"
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      padding: 0.1,
                      fontSize: { xs: "0.6rem", sm: "0.9rem" },
                    }}
                    onClick={() => navigate(`/${product.productId._id}`)}
                  >
                    Dettagli
                  </Button>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.5rem" },
                    }}
                  >
                    {product.productId.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", md: "row" },
                    gap: { xs: 1, md: 3 },
                    alignItems: "center",
                    pt: { xs: 3, sm: 0 },
                    pb: { xs: 1, sm: 0 },
                    pr: { xs: 1, sm: 3 },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.3rem" },
                    }}
                  >
                    {(parseFloat(product.productId.price) * product.quantity)
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}
                    €
                  </Typography>
                  <TextField
                    label="Quantità"
                    variant="outlined"
                    required
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => {
                      const updatedCart = [...userCart];
                      updatedCart[index] = {
                        ...updatedCart[index],
                        quantity: e.target.value,
                      };
                      setUserCart(updatedCart);
                      axios
                        .patch("http://localhost:3000/cart", updatedCart)
                        .then((res) => {
                          setUser(res.data);
                        });
                    }}
                    type="number"
                    inputProps={{
                      min: 1,
                      style: { textAlign: "center" },
                    }}
                    sx={{
                      "& .MuiFormLabel-asterisk": {
                        display: "none",
                      },
                      "& .MuiInputBase-root": {
                        width: { xs: "60px", sm: "80px" },
                        height: { xs: "40px", sm: "50px" },
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.7rem", sm: "1.2rem" },
                      },
                    }}
                  />
                </Box>
                <IconButton
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => {
                    const updatedCart = [...userCart];
                    updatedCart.splice(index, 1);
                    setUserCart(updatedCart);
                    axios
                      .patch("http://localhost:3000/cart", updatedCart)
                      .then((res) => {
                        setUser(res.data);
                      });
                  }}
                >
                  <CancelIcon></CancelIcon>
                </IconButton>
              </Card>
            </Grid>
          ))}
          <Grid size={12}>
            <Card elevation={4}>
              <Box sx={{ textAlign: "end", m: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.5rem" },
                  }}
                >
                  <b>Nr articoli:</b>{" "}
                  {userCart.reduce(
                    (acc, item) => acc + Number(item.quantity),
                    0
                  )}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.5rem" },
                  }}
                >
                  <b>Totale:</b>{" "}
                  {userCart
                    .reduce(
                      (acc, item) =>
                        acc +
                        Number(item.quantity) *
                          parseFloat(item.productId.price),
                      0
                    )
                    .toFixed(2)
                    .toString()
                    .replace(".", ",")}
                  €
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  onClick={() => {
                    const updatedCart = [];
                    setUserCart(updatedCart);
                    axios
                      .patch("http://localhost:3000/cart", updatedCart)
                      .then((res) => {
                        setUser(res.data);
                      });
                    navigate("/");
                  }}
                  variant="contained"
                  color="grey"
                  fullWidth
                >
                  Svuota carrello
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/order")}
                >
                  Procedi con l'ordine
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
