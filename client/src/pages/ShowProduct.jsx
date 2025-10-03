import apiClient from "../utils/apiClient";

import {
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
  ListSubheader,
  Button,
  TextField,
} from "@mui/material";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-toastify";
import ImageCarousel from "../components/ImageCarousel";

export default function ShowProduct() {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { user, setUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get(`/product/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      });
  }, [id]);

  function formattedDate(dateInput) {
    const date = new Date(dateInput);

    const formattedDate = date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedTime} - ${formattedDate}`;
  }

  const createdAt = formattedDate(product.createdAt);

  const updatedAt = formattedDate(product.updatedAt);

  const deleteProduct = () => {
    apiClient
      .delete(`/product/${id}`)
      .then((res) => {
        toast.success("Prodotto eliminato!");
        navigate("/");
      })
      .catch((err) => {
        const dataError = err.response?.data;
        if (dataError?.message === "Accesso negato") {
          toast.error("Accesso negato!!!");
        }
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      });
  };

  const addToCart = () => {
    if (!user) {
      toast.error("Devi fare il login");
      return;
    }
    apiClient
      .post("/addToCart", {
        productId: id,
        quantity,
      })
      .then((res) => {
        setUser(res.data.user);
        toast.success("Prodotti aggiunti al carrello");
        navigate("/");
      })
      .catch((err) => {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      });
  };

  return (
    <>
      {product && product.images && (
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <Card sx={{ p: 1 }}>
              <Typography variant="h6">
                <b>Categoria: </b>
                {product.category} - {product.subcategory}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ sm: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <ImageCarousel
                images={product.images}
                key={product.images?.length}
              />
              {product.features.length > 0 && (
                <List
                  subheader={
                    <ListSubheader
                      component="div"
                      id="features-list"
                      sx={{
                        bgcolor: "background.paper",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Caratteristiche del prodotto
                    </ListSubheader>
                  }
                >
                  {product.features.map((el, index) => {
                    return (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <FiberManualRecordIcon
                            fontSize="small"
                            sx={{ color: "#3f51b5" }}
                          />
                        </ListItemIcon>

                        <ListItemText primary={el} />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Card>
          </Grid>

          <Grid size={{ sm: 12, md: 8 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                title={product.name}
                subheader={product.brand}
                sx={{
                  "& .MuiCardHeader-title": {
                    fontWeight: "bold",
                    marginBottom: "10px",
                  },
                  "& .MuiCardHeader-subheader": {
                    fontWeight: "bold",
                    fontStyle: "italic",
                    border: "1px solid gray",
                    display: "inline",
                    boxSizing: "content-box",
                    borderRadius: "5px",
                    boxShadow:
                      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                    p: 0.6,
                    color: "#FF5600",
                  },
                }}
              ></CardHeader>
              <CardContent>
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ sm: 12, md: 4 }} sx={{ width: "100%" }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Grid container alignItems="flex-start" spacing={3}>
                  <Grid sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {product.price.replace(".", ",")} €
                    </Typography>
                    <Typography>Prezzo iva inclusa al 22%</Typography>
                  </Grid>
                  <Grid>
                    <TextField
                      label="Quantità"
                      variant="outlined"
                      required
                      name="quantity"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(Number(e.target.value));
                      }}
                      type="number"
                      inputProps={{
                        min: 1,
                        style: { textAlign: "center" },
                      }}
                      sx={{
                        mt: 1.5,
                        "& .MuiFormLabel-asterisk": {
                          display: "none",
                        },
                        width: "5rem",
                        "& input[type=number]": {
                          MozAppearance: "textfield", // Firefox
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                        "& input[type=number]::-webkit-inner-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                      }}
                    />
                  </Grid>
                  <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={addToCart}
                  >
                    Aggiungi al carrello
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {user?.role === "admin" && (
            <Grid size={{ sm: 12, md: 8 }} sx={{ width: "100%" }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", mb: 0.5 }}
                      >
                        <b>Codice prodotto</b>
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1rem", mb: 0.5 }}
                      >
                        {product.productCode}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", mb: 0.5 }}
                      >
                        <b>Data inserimento</b>
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1rem", mb: 0.5 }}
                      >
                        {createdAt}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", mb: 0.5 }}
                      >
                        <b>Ultimo aggiornamento</b>
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1rem", mb: 0.5 }}
                      >
                        {updatedAt}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", mb: 0.5 }}
                      >
                        <b>Quantità</b>
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1rem", mb: 0.5 }}
                      >
                        {product.stock}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "1.1rem", mb: 0.5 }}
                      >
                        <b>Note</b>
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                        {product.notes}
                      </Typography>
                    </Grid>

                    <Grid
                      size={{ xs: 12, sm: 5 }}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/${id}/edit`);
                        }}
                        variant="contained"
                        color="success"
                        fullWidth
                      >
                        Modifica prodotto
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProduct();
                        }}
                        variant="contained"
                        color="error"
                        fullWidth
                      >
                        Elimina prodotto
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
