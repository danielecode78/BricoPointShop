import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import AddProduct from "../pages/AddProduct";
import ShowProduct from "../pages/ShowProduct";
import EditProduct from "../pages/EditProduct";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import OrderHistory from "../pages/OrderHistory";

export default function BricoRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/:id/edit" element={<EditProduct />} />
        <Route path="/:id" element={<ShowProduct />} />
      </Route>
    </Routes>
  );
}
