import { NavLink } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";

import avatarMale from "../assets/profile.jfif";
import avatarFemale from "../assets/avatarFemale.jfif";
import { getCurrentUser } from "../../../backend/src/utils/auth";

import { RxDashboard } from "react-icons/rx";
import { TbTopologyStar3 } from "react-icons/tb";
import { BiAtom, BiMove } from "react-icons/bi";
import { FiLink } from "react-icons/fi";
import { GiMagnet, GiMetalBar } from "react-icons/gi";


interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <RxDashboard size={22} /> },
  { label: "Ruang Ion", path: "/admin/ruang-1", icon: <BiAtom size={22} /> },
  { label: "Ruang Kovalen", path: "/admin/ruang-2", icon: <FiLink size={22} /> },
  { label: "Ruang Elektro", path: "/admin/ruang-3", icon: <GiMagnet size={22} /> },
  { label: "Ruang Lewis", path: "/admin/ruang-4", icon: <TbTopologyStar3 size={22} /> },
  { label: "Ruang Logam", path: "/admin/ruang-5", icon: <GiMetalBar size={22} /> },
  { label: "Ruang Gaya", path: "/admin/ruang-6", icon: <BiMove size={22} /> },
];

const Sidebar = () => {
  const user = getCurrentUser();

  const [avatar, setAvatar] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("avatar");
    setAvatar(saved || avatarMale); // default
  }, []);

  const handleSelectAvatar = (value: string) => {
    setAvatar(value);
    localStorage.setItem("avatar", value);
    setShowPopup(false);
  };

  return (
    <aside className="h-full px-4 py-6 bg-gradient-to-tr from-violet-700 to-violet-950 flex flex-col justify-between">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all gap-2
          ${isActive
                ? "bg-gradient-to-tr from-violet-800 to-blue-500 text-white"
                : "text-white hover:bg-violet-500/30"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* CARD */}
      <div
        style={{ boxShadow: "inset 0 0 16px rgba(0,0,0,0.25)" }}
        className="bg-gradient-to-tr from-white via-gray-300 to-white border-4 border-white backdrop-blur-md py-5 rounded-3xl flex flex-col items-center justify-center text-center"
      >
        <img
          src={avatar}
          alt="profile admin"
          onClick={() => setShowPopup(true)}
          className="w-20  rounded-full mb-3 cursor-pointer hover:scale-105 transition"
        />

        <p className="font-semibold text-lg">
          Hi, {user?.name || "Admin"}
          <br />
          <span className="text-sm font-normal">Selamat Datang</span>
        </p>
      </div>

      {/* POPUP OVERLAY */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[300px] text-center">
            <h2 className="font-semibold mb-4 text-lg">Pilih Avatar</h2>

            <div className="flex justify-center gap-6 mb-4">
              <img
                src={avatarMale}
                onClick={() => handleSelectAvatar(avatarMale)}
                className={`w-20 rounded-full cursor-pointer hover:scale-105 transition shadow ${avatar === avatarMale ? "ring-2 ring-blue-600" : ""}`}
              />

              <img
                src={avatarFemale}
                onClick={() => handleSelectAvatar(avatarFemale)}
                className={`w-20 rounded-full cursor-pointer hover:scale-105 transition shadow ${avatar === avatarFemale ? "ring-2 ring-blue-600" : ""}`}
              />
            </div>

            <button
              className="mt-2 text-sm text-gray-600 hover:text-black transition"
              onClick={() => setShowPopup(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}


    </aside>

  );
};

export default Sidebar;
