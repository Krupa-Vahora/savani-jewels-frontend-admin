import Sidebar from "./sidebar";
import Header from "./header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-auto bg-white p-6 text-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
