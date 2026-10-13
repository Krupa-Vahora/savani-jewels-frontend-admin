"use client";

import DashboardHeader from "./components/DashboardHeader";
import DashboardOverview from "./components/DashboardOverview";
import DashboardStats from "./components/DashboardStats";
import { DashboardContextProvider } from "./DashboardContext";

const Dashboard = () => {
  return (
    <DashboardContextProvider>
      <DashboardHeader />
      <DashboardStats />
      <DashboardOverview />
    </DashboardContextProvider>
  );
};

export default Dashboard;
