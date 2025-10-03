import axios from "axios";
axios.defaults.withCredentials = true;
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-toastify";

export default function OrderHistory() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

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

    return `${formattedDate} - ${formattedTime}`;
  }
  const ordersRef = useRef([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/orders");
        const sortedData = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
        ordersRef.current = sortedData;
      } catch (err) {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      const allFinal = ordersRef.current.every(
        (el) => el.status === "consegnato" || el.status === "annullato"
      );

      if (allFinal) {
        clearInterval(interval);
        console.log("Tutti gli ordini sono evasi");
      } else {
        console.log("Aggiornamento");
        fetchOrders();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const cancelOrder = (id) => {
    const fetchCancel = async () => {
      try {
        const res = await axios.patch("http://localhost:3000/order", {
          orderId: id,
          status: "annullato",
        });
      } catch (err) {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      }
    };

    fetchCancel();
  };

  return (
    <Grid container spacing={2}>
      {orders &&
        orders.map((el, index) => {
          return (
            <Grid
              size={{ xs: 12, lg: 6 }}
              key={index}
              sx={{ "& h6": { fontSize: { xs: "1rem", sm: "1.3rem" } } }}
            >
              {(el.status === "in_attesa" ||
                el.status === "in_preparazione") && (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => cancelOrder(el._id)}
                >
                  Annulla Ordine
                </Button>
              )}
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      pr: 2,
                    }}
                  >
                    <Typography variant="h6" display="inline">
                      Ordine del {formattedDate(el.createdAt)}
                    </Typography>
                    <Typography variant="h6" display="inline">
                      Stato: {el.status.replace("_", " ")}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6">Articoli:</Typography>
                  {el.items.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          backgroundColor: "#e1f5fe",
                          borderRadius: "2px",
                          gap: 1,
                          mb: 1,
                          p: 0.3,
                        }}
                      >
                        <Typography variant="body1" flex={3}>
                          Cod. {item.productId.productCode}
                        </Typography>
                        <Typography variant="body1" flex={5}>
                          {item.productId.name}
                        </Typography>
                        <Typography variant="body1" flex={2}>
                          {item.productId.brand}
                        </Typography>
                        <Typography variant="body1" flex={1}>
                          Pz: {item.quantity}
                        </Typography>
                      </Box>
                    );
                  })}
                  <Box>
                    <Typography variant="h6">
                      Pagamento: {el.paymentMethod}
                    </Typography>
                    <Typography variant="h6">
                      Importo totale:{" "}
                      {el.totalPrice.toString().replace(".", ",")}€
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          );
        })}
    </Grid>
  );
}
