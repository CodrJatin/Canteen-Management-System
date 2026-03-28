import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CookQueue from "./pages/cook/CookQueue";
import ScannerView from "./pages/scanner/ScannerView";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/customer" element={<CustomerDashboard />} />
      <Route path="/cook" element={<CookQueue />} />
      <Route path="/scanner" element={<ScannerView />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;