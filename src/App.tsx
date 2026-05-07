import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Inventory from "./pages/Inventory";
import SystemHealth from "./pages/SystemHealth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="system-health" element={<SystemHealth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;