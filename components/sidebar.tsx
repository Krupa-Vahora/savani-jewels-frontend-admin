"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Sub Categories",
    href: "/sub-categories",
  },
  {
    label: "Product Attributes",
    href: "/product-attributes",
  },
  {
    label: "Product Sizes",
    href: "/product-sizes",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Savani Jewels</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems?.map((item) => {
          const isActive =
            pathname === item?.href || pathname.startsWith(`${item?.href}/`);

          return (
            <Link
              key={item?.href}
              href={item?.href}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item?.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
