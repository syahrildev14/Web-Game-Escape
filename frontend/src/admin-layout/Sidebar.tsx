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
import { FaRegListAlt } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import { RiVideoAddFill } from "react-icons/ri";


interface MenuItem {
  label: string;
  path?: string;
  icon: ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <RxDashboard size={22} /> },
  { label: "Ruang Ion", path: "/admin/ruang-1", icon: <BiAtom size={22} /> },
  { label: "Ruang Kovalen", path: "/admin/ruang-2", icon: <FiLink size={22} /> },
  { label: "Ruang Elektro", path: "/admin/ruang-3", icon: <GiMagnet size={22} /> },
  { label: "Ruang Lewis", path: "/admin/ruang-4", icon: <TbTopologyStar3 size={22} /> },
  { label: "Ruang Logam", path: "/admin/ruang-5", icon: <GiMetalBar size={22} /> },
  { label: "Ruang Gaya", path: "/admin/ruang-6", icon: <BiMove size={22} /> },
  {
    label: "Soal",
    icon: <FaRegListAlt size={22} />,
    children: [
      { label: "Room 1", path: "/admin/soal/room-1", icon: <FaRegCircleDot size={18} /> },
      { label: "Room 2", path: "/admin/soal/room-2", icon: <FaRegCircleDot size={18} /> },
      { label: "Room 3", path: "/admin/soal/room-3", icon: <FaRegCircleDot size={18} /> },
      { label: "Room 4", path: "/admin/soal/room-4", icon: <FaRegCircleDot size={18} /> },
      { label: "Room 5", path: "/admin/soal/room-5", icon: <FaRegCircleDot size={18} /> },
      { label: "Room 6", path: "/admin/soal/room-6", icon: <FaRegCircleDot size={18} /> },
    ],
  },
  { label: "Video", path: "/admin/video", icon: <RiVideoAddFill size={22} /> },
];

const Sidebar = () => {
  const user = getCurrentUser();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
          <div key={item.label}>
            {!item.children ? (
              <NavLink
                to={item.path!}
                end
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-2 text-sm font-medium gap-2 transition-all
          ${isActive
                    ? "bg-gradient-to-tr from-violet-800 to-blue-500 text-white"
                    : "text-white hover:bg-violet-500/30"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ) : (
              <>
                {/* Parent Soal */}
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.label ? null : item.label)
                  }
                  className="w-full flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-violet-500/30 transition"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                  <span>{openDropdown === item.label ? "▲" : "▼"}</span>
                </button>

                {/* Dropdown Items */}
                {openDropdown === item.label && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path!}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
                  ${isActive
                            ? "bg-violet-800 text-white"
                            : "text-white hover:bg-violet-500/30"
                          }`
                        }
                      >
                        {child.icon}
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
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
