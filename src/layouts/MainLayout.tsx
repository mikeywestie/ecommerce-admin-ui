import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Header />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}