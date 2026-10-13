"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const Header = () => {
  const router = useRouter();

  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        <h2 className="text-lg font-semibold">Welcome {admin?.name}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
