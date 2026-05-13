import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Payments from "./pages/admin/Payments";
import Inventory from "./pages/admin/Inventory";
import SystemHealth from "./pages/admin/SystemHealth";

import Products from "./pages/customer/Products";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";

import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="system-health" element={<SystemHealth />} />
        </Route>

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;