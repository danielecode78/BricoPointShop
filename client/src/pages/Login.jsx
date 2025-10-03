import apiClient from "../utils/apiClient";

import { Paper, TextField, Typography, Button, Grid } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-toastify";

export default function Login() {
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const loginSubmit = async (data) => {
    try {
      const res = await apiClient.post("/login", data);
      setUser(res.data.user);
      navigate("/");
      toast.success("Login effettuato con successo!");
    } catch (err) {
      reset({
        username: "",
        password: "",
      });
      const errors = err.response?.data?.errors || [];
      errors.forEach(({ field, message }) => {
        setError(field, {
          type: "manual",
          message,
        });
      });
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      clearErrors(name);
      clearErrors("form");
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <Grid container spacing={{ sm: 5, md: 7 }} columns={12} sx={{ p: 3 }}>
        <Grid size={{ sm: 12, md: 6 }} sx={{ pt: 1 }}>
          <Paper
            component="form"
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
              textAlign: "center",
              borderRadius: "5%",
            }}
            onSubmit={handleSubmit(loginSubmit)}
          >
            <Typography variant="h4">Login utente</Typography>
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
              {...register("password", { required: "Password obbligatoria" })}
              error={!!errors.password}
              helperText={errors.password?.message}
              type="password"
            />
            {errors.form && (
              <Typography color="error" variant="body2">
                {errors.form.message}
              </Typography>
            )}

            <Button type="submit" variant="contained" fullWidth>
              Accedi
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ sm: 12, md: 6 }} sx={{ pt: 1 }}>
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
            autoComplete="off"
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
              textAlign: "center",
              borderRadius: "5%",
            }}
          >
            <Typography variant="h4">Non sei ancora registrato?</Typography>
            <Typography variant="body1">
              Crea gratuitamente il tuo account!
            </Typography>
            <Button type="submit" variant="contained" fullWidth>
              Registrazione
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
