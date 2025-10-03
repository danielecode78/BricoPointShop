// client/src/utils/apiClient.js
import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export default apiClient;
