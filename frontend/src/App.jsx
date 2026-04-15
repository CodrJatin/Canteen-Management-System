import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChefDashboard from "./pages/chef/ChefDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Scanner from "./pages/scanner/Scanner";
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from "./context/authContext";

function App() {
  const { user } = useAuth();

  return (
    <Routes>

      <Route path="/" element={
        !user ? <Login /> : <Navigate to={`/${user.role === 'customer' ? 'customer' : user.role}`} replace />
      } />

      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chef"
        element={
          <ProtectedRoute allowedRole="chef">
            <ChefDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scanner"
        element={
          <ProtectedRoute allowedRole="scanner">
            <Scanner />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;