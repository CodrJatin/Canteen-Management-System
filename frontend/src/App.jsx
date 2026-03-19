import { Routes, Route, Navigate } from "react-router"; // Remove BrowserRouter from here
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CookQueue from "./pages/cook/CookQueue";
import CustomerMenu from "./pages/customer/CustomerMenu";
import ScannerView from "./pages/scanner/ScannerView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/customer" element={<CustomerMenu />} />
      <Route path="/cook" element={<CookQueue />} />
      <Route path="/scanner" element={<ScannerView />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;