import apiClient from "../utils/apiClient";

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
import { useNavigate, useParams } from "react-router-dom";
import ImageDropzone from "../components/ImageDropzone";
import InputFeatures from "../components/InputFeatures";
import ImageManager from "../components/ImageManager";
import { toast } from "react-toastify";

const customTitle = {
  // color: "#3f51b5",
  fontWeight: "bold",
  fontSize: "1.5em",
  textAlign: "center",
};

export default function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [indexCategory, setIndexCategory] = useState(null);
  const [subselectedCategory, setSubselectedCategory] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [oldImages, setOldImages] = useState([]);
  const [images, setImages] = useState([]);
  const [formValues, setFormValues] = useState({
    productCode: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    features: [],
  });

  useEffect(() => {
    const axiosData = async () => {
      try {
        const [categoriesRes, brandsRes, productRes] = await Promise.all([
          apiClient.get("/categories"),
          apiClient.get("/brands"),
          apiClient.get(`/product/${id}`),
        ]);

        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
        const product = productRes.data;
        const categoryIndex = categoriesRes.data.findIndex(
          (el) => el.name === product.category
        );
        if (categoryIndex !== -1) {
          setSelectedCategory(product.category);
          setIndexCategory(categoryIndex);
          setSubselectedCategory(product.subcategory);
        }

        const newPrice = parseFloat(product.price);

        setFormValues({
          productCode: product.productCode,
          name: product.name,
          description: product.description,
          price: newPrice,
          stock: product.stock,
          features: product.features,
          notes: product.notes || "",
        });

        setSelectedCategory(product.category);
        setSubselectedCategory(product.subcategory);
        setSelectedBrand(product.brand);
        setOldImages(product.images);
      } catch (err) {
        const dataError = err.response?.data;
        console.log("Status code:", dataError?.statusCode);
        console.log("Messaggio:", dataError?.message);
        console.log("Stack:", dataError?.stack);
      }
    };
    axiosData();
  }, [id]);

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
    formData.append("oldImages", JSON.stringify(oldImages));
    formData.append("brand", selectedBrand);
    formData.append("notes", formValues.notes);

    images.forEach((file, index) => {
      formData.append("images", file);
    });

    await apiClient
      .put(`/product/${id}/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/${id}`);
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
            MODIFICA PRODOTTO
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
                value={selectedCategory || ""}
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
                value={subselectedCategory || ""}
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
          <ImageManager oldImages={oldImages} setOldImages={setOldImages} />
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
            Modifica prodotto
          </Button>
        </Box>
      </Paper>
    </>
  );
}
