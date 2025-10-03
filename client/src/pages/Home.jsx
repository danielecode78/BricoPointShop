import apiClient from "../utils/apiClient";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [disclaimer, setDisclaimer] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subcategory = searchParams.get("subcategory");
  const search = searchParams.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = search ? { search } : subcategory ? { subcategory } : {};

        const res = await apiClient.get("/products", {
          params,
        });
        setProducts(res.data);
      } catch (err) {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      }
    };

    fetchProducts();
  }, [subcategory, search]);

  const AvaibleIcon = styled(CircleIcon)(({ theme }) => ({
    color: "green",
  }));
  const NotAvaibleIcon = styled(CircleIcon)(({ theme }) => ({
    color: "red",
  }));

  const theme = useTheme();
  const customBreakpoint = useMediaQuery(
    "(min-width:450px) and (max-width:600px)"
  );
  return (
    <>
      {disclaimer && (
        <Alert
          severity="error"
          onClose={() => {
            setDisclaimer(false);
          }}
          sx={{
            my: 2,
            fontSize: { xs: "0.7rem", sm: "1.3rem" },
            textAlign: "justify",
          }}
        >
          Attenzione: questo sito è stato realizzato esclusivamente a scopo
          dimostrativo e non rappresenta un’attività commerciale reale. Gli
          articoli presenti sono fittizi e non sono in vendita. Qualsiasi
          riferimento a prodotti, prezzi, disponibilità o funzionalità è
          puramente illustrativo. L’accesso è consentito solo a persone
          autorizzate o invitate dall’autore. L’autore non si assume alcuna
          responsabilità per l’uso improprio, fraudolento o non autorizzato
          delle informazioni contenute nel sito. Non è garantita l’accuratezza,
          la completezza o l’aggiornamento dei contenuti. Ogni utilizzo del sito
          o dei suoi dati è a rischio esclusivo dell’utente. Questo progetto è
          stato sviluppato come portfolio tecnico e non deve essere interpretato
          come un servizio attivo, un negozio online o una piattaforma
          operativa.
        </Alert>
      )}

      <Grid container spacing={{ xs: 2, md: 3 }} columns={12}>
        {subcategory && (
          <Grid size={12}>
            <Card sx={{ p: 1 }}>
              <Typography variant="h6">
                <b>Tutti i prodotti per: </b>
                {subcategory}
              </Typography>
            </Card>
          </Grid>
        )}
        {products.map((product) => (
          <Grid
            key={product._id}
            size={customBreakpoint ? 6 : { xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Card>
              <CardActionArea onClick={() => navigate(`/${product._id}`)}>
                <Box
                  sx={{
                    height: { xs: "250px", sm: "400px" },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      aspectRatio: "16/9",
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      image={
                        product.images.length > 0
                          ? product.images[0].url
                          : "https://res.cloudinary.com/ds0kjkr1o/image/upload/v1756281555/samples/food/pot-mussels.jpg"
                      }
                      alt="immagine del prodotto"
                    />
                  </Box>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 0.3,
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{
                        fontSize: { xs: "1.3rem", sm: "1.5rem" },
                        textAlign: "justify",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        display: { xs: "none", sm: "-webkit-box" },
                        textAlign: "justify",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.description}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        pl: 1,
                        pb: { xs: 1 },
                      }}
                    >
                      {product.stock > 0 ? <AvaibleIcon /> : <NotAvaibleIcon />}

                      <Typography
                        variant="subtitle1"
                        sx={
                          customBreakpoint
                            ? { fontSize: "0.8rem" }
                            : {
                                fontSize: { xs: "1rem", sm: "1.2em" },
                              }
                        }
                      >
                        {product.stock > 0 ? "Disponibile" : "Non disponibile"}
                      </Typography>
                    </Box>
                    <Box sx={{ pb: { xs: 1 } }}>
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "clamp(1.3em, 3.5vw, 1.8rem)",
                          fontWeight: "bold",
                          letterSpacing: 1,
                          pr: 2,
                        }}
                      >
                        {product.price.replace(".", ",")}€
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
