import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthAnim from "./components/AuthAnim";
import ProductPage from "./components/ProductPage.tsx";
import Profile from "./components/Profile.tsx";
import AdminDashboard from "./components/AdminDashboard";
import CartPage from "./components/CartPage.tsx";
import { useTheme } from "./context/ThemeContext";

// Create a client
const queryClient = new QueryClient();

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function AppContent() {
  const { theme: appTheme } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      appTheme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`}>
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
          path="/cart"
          element={
            <ProtectedRoute includeNavbar>
              <CartPage />
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
          path="/admin"
          element={
            <ProtectedRoute includeNavbar>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
