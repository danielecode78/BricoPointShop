import BricoRoutes from "./routes/BricoRoutes.jsx";
import { AuthProvider } from "./components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AuthProvider>
        <BricoRoutes />
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={true}
        />
      </AuthProvider>
    </>
  );
}

export default App;
