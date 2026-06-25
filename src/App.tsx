import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Coupons = lazy(() => import("./pages/admin/Coupons"));
const SystemHealth = lazy(() => import("./pages/admin/SystemHealth"));

const Products = lazy(() => import("./pages/customer/Products"));
const ProductDetails = lazy(() => import("./pages/customer/ProductDetails"));
const Cart = lazy(() => import("./pages/customer/Cart"));
const Checkout = lazy(() => import("./pages/customer/Checkout"));
const OrderSuccess = lazy(() => import("./pages/customer/OrderSuccess"));
const CustomerOrders = lazy(() => import("./pages/customer/CustomerOrders"));

function App() {
  return (
    <BrowserRouter basename="/ecommerce-admin-ui">
      <Suspense fallback={null}>
        <Routes>
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
            <Route path="coupons" element={<Coupons />} />
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
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="order-success" element={<OrderSuccess />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
