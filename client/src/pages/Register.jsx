import apiClient from "../utils/apiClient";

import {
  Box,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
} from "@mui/material";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthProvider";

export default function Register() {
  const miniRecaptcha = useMediaQuery("(max-width: 430px)");
  const miniRecaptcha2 = useMediaQuery("(max-width: 370px)");
  const [captchaToken, setCaptchaToken] = useState("");
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      role: "user",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      addressToSend: {
        street: "",
        city: "",
        zip: "",
      },
      addressLegal: {
        street: "",
        city: "",
        zip: "",
      },
      cart: [],
      orders: [],
    },
  });

  const gdprConsent = watch("gdprConsent");
  const navigate = useNavigate();
  const submitForm = async (data) => {
    toast.error(
      "Attualmente registrazione disabilitata, progetto dimostrativo"
    );
    // const { verifyPassword, gdprConsent, ...cleanData } = data;

    // await apiClient
    //   .post("/register", cleanData)
    //   .then((res) => {
    //     setUser(res.data.user);
    //     navigate("/");
    //     toast.success("Registrazione avvenuta con successo!");
    //   })
    //   .catch((err) => {
    //     const dataError = err.response?.data;
    //     console.log("Status code:", dataError?.statusCode);
    //     console.log("Messaggio:", dataError?.message);
    //     console.log("Stack:", dataError?.stack);
    //     if (
    //       dataError.message ===
    //       "A user with the given username is already registered"
    //     ) {
    //       toast.error("Username già utilizzato!");
    //     } else if (dataError.message.includes("email")) {
    //       toast.error("Email già presente nel sistema");
    //     }
    //   });
  };

  return (
    <>
      <Paper
        component="form"
        elevation={3}
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
        onSubmit={handleSubmit(submitForm)}
      >
        <Typography variant="h4">Registrazione utente</Typography>
        <Grid container columns={12} spacing={3} sx={{ width: "100%" }}>
          <Grid size={{ sm: 12, md: 6 }} sx={{ width: "100%" }}>
            <Box
              component="fieldset"
              sx={{
                border: "1px dashed #3f51b5",
                borderRadius: 2,
                p: 2,
                mb: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              <Typography
                component="legend"
                variant="h6"
                sx={{ mb: 2, color: "#3f51b5" }}
              >
                Dati utente
              </Typography>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                {...register("username", { required: "Username obbligatorio" })}
                error={!!errors.username}
                helperText={errors.username?.message}
                type="text"
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                {...register("password", {
                  required: "Password obbligatoria",
                  minLength: {
                    value: 6,
                    message: "Minimo 6 caratteri",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                type="password"
              />
              <TextField
                label="Conferma password"
                variant="outlined"
                fullWidth
                {...register("verifyPassword", {
                  validate: (value) =>
                    value === watch("password") || "Le password non coincidono",
                })}
                error={!!errors.verifyPassword}
                helperText={errors.verifyPassword?.message}
                type="password"
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                {...register("email", {
                  required: "Email obbligatoria",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Formato email non valido",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                type="email"
              />
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                {...register("firstName", { required: "Nome obbligatorio" })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                type="text"
              />
              <TextField
                label="Cognome"
                variant="outlined"
                fullWidth
                {...register("lastName", { required: "Cognome obbligatorio" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                type="text"
              />
              <TextField
                label="Telefono"
                variant="outlined"
                fullWidth
                {...register("phone", { required: "Telefono obbligatorio" })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                type="text"
              />
            </Box>
          </Grid>
          <Grid size={{ sm: 12, md: 6 }} sx={{ width: "100%" }}>
            <Box
              component="fieldset"
              sx={{
                border: "1px dashed #3f51b5",
                borderRadius: 2,
                p: 2,
                mb: 1,
                display: "flex",
                flexDirection: { xs: "column", sm: "row", md: "column" },
                gap: 2,
                width: "100%",
              }}
            >
              <Typography
                component="legend"
                variant="h6"
                sx={{ mb: 2, color: "#3f51b5" }}
              >
                Indirizzo di spedizione
              </Typography>
              <TextField
                label="Via"
                variant="outlined"
                fullWidth
                {...register("addressToSend.street", {
                  required: "Via obbligatoria",
                })}
                error={!!errors.addressToSend?.street}
                helperText={errors.addressToSend?.street?.message}
                sx={{ flex: 7 }}
              />
              <TextField
                label="Città"
                variant="outlined"
                fullWidth
                {...register("addressToSend.city", {
                  required: "Città obbligatoria",
                })}
                error={!!errors.addressToSend?.city}
                helperText={errors.addressToSend?.city?.message}
                sx={{ flex: 3 }}
              />
              <TextField
                label="Codice postale"
                variant="outlined"
                fullWidth
                {...register("addressToSend.zip", {
                  required: "CAP obbligatorio",
                })}
                error={!!errors.addressToSend?.zip}
                helperText={errors.addressToSend?.zip?.message}
                sx={{ flex: 2 }}
              />
            </Box>
            <Box
              component="fieldset"
              sx={{
                border: "1px dashed #3f51b5",
                borderRadius: 2,
                p: 2,
                mb: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row", md: "column" },
                gap: 2,
                width: "100%",
              }}
            >
              <Typography
                component="legend"
                variant="h6"
                sx={{ mb: 2, color: "#3f51b5" }}
              >
                Indirizzo di fatturazione
              </Typography>
              <TextField
                label="Via"
                variant="outlined"
                fullWidth
                {...register("addressLegal.street", {
                  required: "Via obbligatoria",
                })}
                error={!!errors.addressLegal?.street}
                helperText={errors.addressLegal?.street?.message}
                sx={{ flex: 7 }}
              />
              <TextField
                label="Città"
                variant="outlined"
                fullWidth
                {...register("addressLegal.city", {
                  required: "Città obbligatoria",
                })}
                error={!!errors.addressLegal?.city}
                helperText={errors.addressLegal?.city?.message}
                sx={{ flex: 3 }}
              />
              <TextField
                label="Codice postale"
                variant="outlined"
                fullWidth
                {...register("addressLegal.zip", {
                  required: "CAP obbligatorio",
                })}
                error={!!errors.addressLegal?.zip}
                helperText={errors.addressLegal?.zip?.message}
                sx={{ flex: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={
              miniRecaptcha2
                ? { transform: "scale(0.65)", transformOrigin: "top left" }
                : miniRecaptcha
                ? { transform: "scale(0.8)", transformOrigin: "top left" }
                : {}
            }
          >
            <ReCAPTCHA
              sitekey="6Lfjos4rAAAAAJ8nPwQ2J7wtRpFeoaXS1jjmt-rx"
              onChange={(token) => setCaptchaToken(token)}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  {...register("gdprConsent", {
                    required: "Devi acconsentire al trattamento dei dati",
                  })}
                />
              }
              label="Acconsento al trattamento dei dati personali ai sensi del GDPR"
            />
            {errors.gdprConsent && (
              <Typography color="error" variant="body2">
                {errors.gdprConsent.message}
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!captchaToken || !gdprConsent}
        >
          Registrati
        </Button>
      </Paper>
    </>
  );
}
