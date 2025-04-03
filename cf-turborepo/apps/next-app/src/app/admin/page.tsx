"use client";

import { useState } from "react";
import DashboardContent from "./components/DashboardContent";
import CampaignsContent from "./components/CampaignsContent";
import InitiativesContent from "./components/InitiativesContent";
import UsersContent from "./components/UsersContent";
import { AdminLayout } from "./components/AdminLayout";

export default function AdminPanel() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // Определяне кой компонент да бъде показан
  const getActiveComponent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "campaigns":
        return <CampaignsContent />;
      case "initiatives":
        return <InitiativesContent />;
      case "users":
        return <UsersContent />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-muted-foreground">Изберете секция от менюто за да видите съдържанието</p>
          </div>
        );
    }
  };

  return (
    <AdminLayout 
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      {getActiveComponent()}
    </AdminLayout>
  );
}
