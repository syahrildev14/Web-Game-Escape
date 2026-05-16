import { useState, type ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({
  children,
}: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        bg-gray-100
        cursor-default
      "
    >
      {/* HEADER */}
      <Header />

      {/* BODY */}
      <div className="flex flex-1 relative">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              fixed
              inset-0
              bg-black/40
              z-40
              md:hidden
            "
          />
        )}

        {/* SIDEBAR MOBILE */}
        <aside
          className={`
            fixed
            top-0
            left-0
            z-50

            h-screen
            w-72

            bg-white
            border-r
            shadow-xl

            transform
            transition-transform
            duration-300

            md:hidden

            ${sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            }
          `}
        >
          <div className="p-4 flex justify-end">
            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="
                text-2xl
                font-bold
                text-gray-600
              "
            >
              ✕
            </button>
          </div>

          <Sidebar />
        </aside>

        {/* SIDEBAR DESKTOP */}
        <aside
          className="
            hidden
            md:block

            w-64
            bg-white
            border-r
            shrink-0
          "
        >
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main
          className="
            flex-1
            p-4
            sm:p-5
            md:p-6

            overflow-y-auto
            w-full
          "
        >
          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden mb-4">
            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="
                px-4
                py-2

                bg-blue-800
                text-white

                rounded-xl
                shadow

                font-semibold
              "
            >
              ☰ Menu
            </button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;