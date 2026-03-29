import { Routes, Route, Navigate } from "react-router-dom"; // Use react-router-dom
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChefDashboard from "./pages/chef/ChefDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from "./context/authContext";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* --- ROOT LOGIC --- */}
      <Route path="/" element={
        !user ? <Login /> : <Navigate to={`/${user.role === 'customer' ? 'customer' : user.role}`} replace />
      } />

      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

      {/* --- PROTECTED CUSTOMER ROUTE --- */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer"> {/* Changed "user" to "customer" */}
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* --- PROTECTED ADMIN ROUTE --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* --- PROTECTED CHEF ROUTE --- */}
      <Route
        path="/chef"
        element={
          <ProtectedRoute allowedRole="chef">
            <ChefDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: Send unknown routes back home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;