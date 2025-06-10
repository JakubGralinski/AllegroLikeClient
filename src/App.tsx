import { Routes, Route, Navigate } from "react-router-dom";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  PaletteMode,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthAnim from "./components/AuthAnim";
import ProductPage from "./components/ProductPage.tsx";
import Profile from "./components/Profile.tsx";
import CartPage from "./components/CartPage.tsx";
import { useTheme } from "./context/ThemeContext";
import CreateProduct from "./components/CreateProduct.tsx";
import Orders from "./components/Orders.tsx";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { theme: appTheme } = useTheme();

  // Create MUI theme dynamically based on our appTheme
  const muiTheme = createTheme({
    palette: {
      mode: appTheme as PaletteMode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={muiTheme}>
        <div
          className={`min-h-screen absolute min-w-screen top-0 left-0 ${appTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
        >
          <AuthProvider>
            <Routes>
              <Route
                path="/login"
                element={
                  <>
                    <AuthAnim />
                    <Login />
                  </>
                }
              />
              <Route
                path="/register"
                element={
                  <>
                    <AuthAnim />
                    <Register />
                  </>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute includeNavbar>
                    <ProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/createProduct"
                element={
                  <ProtectedRoute includeNavbar>
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute includeNavbar>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute includeNavbar>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute includeNavbar>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </div>
      </MuiThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
