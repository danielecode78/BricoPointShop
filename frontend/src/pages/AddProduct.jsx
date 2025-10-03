import axios from "axios";
axios.defaults.withCredentials = true;
import {
  Box,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageDropzone from "../components/ImageDropzone";
import InputFeatures from "../components/InputFeatures";

const customTitle = {
  // color: "#3f51b5",
  fontWeight: "bold",
  fontSize: "1.5em",
  textAlign: "center",
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [indexCategory, setIndexCategory] = useState(null);
  const [subselectedCategory, setSubselectedCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [images, setImages] = useState([]);
  const [formValues, setFormValues] = useState({
    productCode: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    features: [],
    notes: "",
  });

  useEffect(() => {
    const axiosData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get("http://localhost:3000/categories"),
          axios.get("http://localhost:3000/brands"),
        ]);

        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (err) {
        const dataError = err.response?.data;
        if (dataError?.message === "Accesso negato") {
          toast.error("Accesso negato!!!");
        }
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      }
    };

    axiosData();
  }, []);

  const submitForm = async () => {
    const formData = new FormData();

    // Dati testuali
    formData.append("productCode", formValues.productCode);
    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price);
    formData.append("stock", formValues.stock);
    formData.append("category", selectedCategory);
    formData.append("subcategory", subselectedCategory);
    formData.append("features", JSON.stringify(formValues.features));
    formData.append("brand", selectedBrand);
    formData.append("notes", formValues.notes);

    // Immagini
    images.forEach((file, index) => {
      formData.append("images", file);
    });

    await axios
      .post("http://localhost:3000/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
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
      <Paper elevation={5} sx={{ mt: 4 }}>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
            p: 3,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          autoComplete="off"
        >
          <Typography component="h1" variant="h4" sx={customTitle}>
            INSERIMENTO PRODOTTO
          </Typography>
          <TextField
            label="Codice prodotto"
            variant="outlined"
            fullWidth
            required
            name="productCode"
            value={formValues.productCode}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
              })
            }
            type="text"
          />
          <TextField
            label="Nome del prodotto"
            variant="outlined"
            fullWidth
            required
            name="name"
            value={formValues.name}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
              })
            }
            type="text"
          />
          <TextField
            label="Descrizione  del prodotto"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            required
            name="description"
            value={formValues.description}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
              })
            }
            type="text"
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="category-label">Categoria</InputLabel>
              <Select
                labelId="category-label"
                value={selectedCategory}
                label="Categoria"
                onChange={(e, child) => {
                  const name = e.target.value;
                  const index = child.props["data-index"];
                  setSelectedCategory(name);
                  setIndexCategory(index);
                }}
              >
                {categories.map((cat, index) => (
                  <MenuItem key={cat._id} value={cat.name} data-index={index}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="subcategory-label">Sottocategoria</InputLabel>
              <Select
                labelId="subcategory-label"
                value={subselectedCategory}
                label="Sottocategoria"
                onChange={(e) => setSubselectedCategory(e.target.value)}
              >
                {indexCategory !== null &&
                  categories[indexCategory].subcategories.map((cat) => (
                    <MenuItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="brand-label">Marchio</InputLabel>
              <Select
                labelId="brand-label"
                value={selectedBrand}
                label="Marchio"
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                }}
              >
                {brands.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Prezzo in €"
              variant="outlined"
              fullWidth
              required
              name="price"
              value={formValues.price}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                })
              }
              type="number"
              inputProps={{ step: "0.01" }}
            />
            <TextField
              label="Quantità disponibile"
              variant="outlined"
              fullWidth
              required
              name="stock"
              value={formValues.stock}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                })
              }
              type="number"
            />
          </Box>
          <InputFeatures
            formValues={formValues}
            setFormValues={setFormValues}
          />
          <ImageDropzone onFilesChange={(files) => setImages(files)} />
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Note"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            name="notes"
            value={formValues.notes}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
              })
            }
            type="text"
          />
          <Button type="submit" variant="contained" fullWidth>
            Aggiungi prodotto
          </Button>
        </Box>
      </Paper>
    </>
  );
}
