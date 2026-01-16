import Swal from "sweetalert2";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan keluar dari sesi admin.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");

        Swal.fire({
          title: "Berhasil!",
          text: "Anda telah logout.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    });
  };

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-gradient-to-tr from-violet-900 to-blue-600 text-white">
      <h1 className="font-semibold text-2xl">Admin Panel</h1>

      <button
        onClick={handleLogout}
        className="
          flex items-center justify-center gap-3
          text-base font-semibold text-violet-900
          bg-gradient-to-t from-blue-400 to-blue-200
          px-6 py-2 rounded-lg
          transition duration-300 hover:scale-95
        "
      >
        <TbLogout2 size={22} />
        Logout
      </button>
    </header>
  );
};

export default Header;
