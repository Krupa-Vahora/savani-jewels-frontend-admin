import AdminLayout from "@/components/admin-layout";
import ProtectedRoute from "@/components/protected-route";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
