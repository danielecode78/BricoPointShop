import apiClient from "../utils/apiClient";

import {
  Typography,
  Grid,
  Card,
  IconButton,
  Box,
  Paper,
  CardMedia,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Order() {
  const { user, setUser } = useAuth();
  const [dataUser, setDataUser] = useState({});
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/user");
        setDataUser(res.data);

        const cartItems = res.data.cart || [];
        const shippingCost = 8.5;

        const totalPay = (
          cartItems.reduce((acc, item) => {
            const price = parseFloat(item.productId?.price || "0");
            const qty = Number(item.quantity || 0);
            return acc + price * qty;
          }, 0) + shippingCost
        ).toFixed(2);

        reset({
          userId: user._id,
          shippingData: {
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            street: res.data.addressToSend.street,
            city: res.data.addressToSend.city,
            zip: res.data.addressToSend.zip,
            phone: res.data.phone,
            notes: "",
          },
          items: [...res.data.cart],
          shippingCost,
          totalPrice: totalPay,
        });
      } catch (err) {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      }
    };

    fetchUser();
  }, [reset]);

  const values = watch();

  const submitForm = async (data) => {
    await apiClient
      .post("/order", data)
      .then((res) => {
        const resetCart = [];
        apiClient.patch("/cart", resetCart).then((res) => {
          setUser(res.data);
        });
        navigate("/");
        toast.success("Ordine effettuato con successo!");
      })
      .catch((err) => {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      });
  };

  return (
    <Paper
      elevation={5}
      sx={{ mt: 4 }}
      component="form"
      onSubmit={handleSubmit(submitForm)}
      autoComplete="off"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
          p: 3,
        }}
      >
        <Box
          component="fieldset"
          sx={{
            border: "1px dashed black",
            borderRadius: 2,
            p: 2,
            mb: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography
            component="legend"
            variant="h6"
            sx={{ mb: 2, color: "black" }}
          >
            Dati di spedizione
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Nome"
              variant="outlined"
              fullWidth
              {...register("shippingData.firstName", {
                required: "Nome obbligatorio",
              })}
              error={!!errors.shippingData?.firstName}
              helperText={errors.shippingData?.firstName?.message}
              sx={{ flex: 3 }}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Cognome"
              variant="outlined"
              fullWidth
              {...register("shippingData.lastName", {
                required: "Cognome obbligatorio",
              })}
              error={!!errors.shippingData?.lastName}
              helperText={errors.shippingData?.lastName?.message}
              sx={{ flex: 3 }}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Cellulare"
              variant="outlined"
              fullWidth
              {...register("shippingData.phone", {
                required: "Cellulare obbligatorio",
              })}
              error={!!errors.shippingData?.phone}
              helperText={errors.shippingData?.phone?.message}
              sx={{ flex: 2 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Via"
              variant="outlined"
              fullWidth
              {...register("shippingData.street", {
                required: "Via obbligatoria",
              })}
              error={!!errors.shippingData?.street}
              helperText={errors.shippingData?.street?.message}
              sx={{ flex: 7 }}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Città"
              variant="outlined"
              fullWidth
              {...register("shippingData.city", {
                required: "Città obbligatoria",
              })}
              error={!!errors.shippingData?.city}
              helperText={errors.shippingData?.city?.message}
              sx={{ flex: 3 }}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="CAP"
              variant="outlined"
              fullWidth
              {...register("shippingData.zip", {
                required: "CAP obbligatorio",
              })}
              error={!!errors.shippingData?.zip}
              helperText={errors.shippingData?.zip?.message}
              sx={{ flex: 2 }}
            />
          </Box>
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Note di spedizione"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            {...register("shippingData.notes")}
            sx={{ flex: 2 }}
          />
        </Box>
      </Box>
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontSize: { xs: "1.2rem", sm: "1.6rem" },
          textAlign: "center",
          //   color: "#3f51b5",
        }}
      >
        Riepilogo ordine
      </Typography>
      {values.items?.map((product, index) => (
        <Box
          key={product._id}
          sx={{
            px: 3,
            pt: 1,
          }}
        >
          <Card
            sx={{
              px: 2,
              py: 1,
            }}
          >
            <Grid
              container
              sx={{ width: "100%", alignItems: "center" }}
              spacing={1}
            >
              <Grid size={2}>
                <CardMedia
                  component="img"
                  sx={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    objectFit: "contain",
                    aspectRatio: 1 / 1,
                  }}
                  image={
                    product.productId.images.length > 0
                      ? product.productId.images[0].url
                      : "https://res.cloudinary.com/ds0kjkr1o/image/upload/v1756281555/samples/food/pot-mussels.jpg"
                  }
                  alt="immagine del prodotto"
                />
              </Grid>
              <Grid size={7}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontSize: { xs: "0.9rem", sm: "1.2rem" } }}
                >
                  {product.productId.name}
                </Typography>
              </Grid>
              <Grid container size={3}>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      whiteSpace: "nowrap",
                      fontSize: { xs: "0.8rem", sm: "1.1rem" },
                      textAlign: "right",
                    }}
                  >
                    pz: {product.quantity}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "1.1rem" },
                      textAlign: "right",
                    }}
                  >
                    {(parseFloat(product.productId.price) * product.quantity)
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}
                    €
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Box>
      ))}

      <Box
        key={"finalBox"}
        sx={{
          px: 3,
          pt: 1,
        }}
      >
        <Card
          sx={{
            px: 2,
            py: 1,
          }}
        >
          <Grid
            container
            sx={{ width: "100%", alignItems: "center" }}
            spacing={1}
          >
            <Grid size={9}>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontSize: { xs: "0.9rem", sm: "1.2rem" }, py: 1 }}
              >
                Spese di spedizione:
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontSize: { xs: "0.9rem", sm: "1.2rem" }, py: 1 }}
              >
                Totale da pagare:
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography
                variant="h5"
                component="div"
                color="success"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "1.1rem" },
                  textAlign: "right",
                  py: 1,
                  fontWeight: 700,
                }}
              >
                +{" "}
                {values.shippingCost &&
                  values.shippingCost.toFixed(2).toString().replace(".", ",")}
                €
              </Typography>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "1.1rem" },
                  textAlign: "right",
                  py: 1,
                }}
              >
                {values.items && values.totalPrice}€
              </Typography>
            </Grid>
            <Grid size={12}>
              <Button
                variant="contained"
                fullWidth
                color="success"
                type="submit"
              >
                Procedi con l'acquisto
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Paper>
  );
}
