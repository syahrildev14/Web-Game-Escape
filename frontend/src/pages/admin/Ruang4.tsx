import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { RiDeleteBinFill } from "react-icons/ri";


import AdminLayout from "../../admin-layout/AdminLayout";

interface Result {
  playerName: string;
  pretestScore: number;
  posttestScore: number;
  createdAt: string;
}

const Ruang1 = () => {
  const [data, setData] = useState<Result[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "pre" | "post" | "delta" | "date" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/results/room/lewis")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredData = useMemo(() => {
    let temp = [...data];

    if (search.trim() !== "") {
      temp = temp.filter(item =>
        item.playerName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortField !== "") {
      temp.sort((a, b) => {
        const deltaA = a.posttestScore - a.pretestScore;
        const deltaB = b.posttestScore - b.pretestScore;

        const valA =
          sortField === "name" ? a.playerName.toLowerCase() :
            sortField === "pre" ? a.pretestScore :
              sortField === "post" ? a.posttestScore :
                sortField === "delta" ? deltaA :
                  sortField === "date" ? new Date(a.createdAt).getTime() : 0;

        const valB =
          sortField === "name" ? b.playerName.toLowerCase() :
            sortField === "pre" ? b.pretestScore :
              sortField === "post" ? b.posttestScore :
                sortField === "delta" ? deltaB :
                  sortField === "date" ? new Date(b.createdAt).getTime() : 0;

        if (typeof valA === "string" && typeof valB === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortOrder === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);

      });
    }

    return temp;
  }, [data, search, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang sudah dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/results/${id}`)
          .then(() => {
            setData(prev => prev.filter(item => (item as any)._id !== id));

            Swal.fire({
              title: "Terhapus!",
              text: "Data berhasil dihapus.",
              icon: "success",
              timer: 1500
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Gagal!",
              text: "Terjadi kesalahan saat menghapus data.",
              icon: "error"
            });
          });
      }
    });
  };



  return (
    <AdminLayout>
      <div className="p-3 sm:p-4 md:p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-lg sm:text-xl font-bold">
            📊 Ruang Lewis — Hasil Pemain
          </h1>

          {/* SEARCH */}
          <input
            placeholder="Cari nama..."
            className="
          border border-gray-300
          px-3 py-2
          rounded-xl
          shadow-sm
          w-full md:w-72
          outline-none
          transition
          focus:ring-2 focus:ring-violet-500
          focus:border-violet-500
        "
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div
          className="
        overflow-x-auto
        rounded-2xl
        shadow-lg
        border border-gray-200
        bg-white
      "
        >
          <table className="min-w-[850px] w-full border-collapse">
            <thead className="bg-violet-600 text-white select-none">
              <tr>
                <th className="px-3 py-3 text-center whitespace-nowrap">
                  No
                </th>

                <th
                  className="px-3 py-3 text-center cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort("name")}
                >
                  Nama{" "}
                  {sortField === "name"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "↕"}
                </th>

                <th
                  className="px-3 py-3 text-center cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort("pre")}
                >
                  Pre{" "}
                  {sortField === "pre"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "↕"}
                </th>

                <th
                  className="px-3 py-3 text-center cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort("post")}
                >
                  Post{" "}
                  {sortField === "post"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "↕"}
                </th>

                <th
                  className="px-3 py-3 text-center cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort("delta")}
                >
                  Peningkatan{" "}
                  {sortField === "delta"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "↕"}
                </th>

                <th
                  className="px-3 py-3 text-center cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort("date")}
                >
                  Tanggal{" "}
                  {sortField === "date"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : "↕"}
                </th>

                <th className="px-3 py-3 text-center whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((row, i) => (
                <tr
                  key={i}
                  className="
                odd:bg-white
                even:bg-gray-50
                hover:bg-violet-50
                transition-colors
                border-b border-gray-100
              "
                >
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {i + 1}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-700">
                    {row.playerName}
                  </td>

                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {row.pretestScore}
                  </td>

                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    {row.posttestScore}
                  </td>

                  <td
                    className="
                  px-3 py-3
                  text-center
                  font-semibold
                  text-blue-600
                  whitespace-nowrap
                "
                  >
                    {row.posttestScore - row.pretestScore}
                  </td>

                  <td className="px-3 py-3 text-center whitespace-nowrap text-gray-600">
                    {new Date(row.createdAt).toLocaleDateString("id-ID")}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex justify-center">
                      <button
                        className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-3 py-2
                      rounded-lg
                      flex items-center gap-2
                      text-sm
                      transition-all
                      duration-200
                      shadow-sm
                      hover:shadow-md
                      whitespace-nowrap
                    "
                        onClick={() => handleDelete((row as any).id)}
                      >
                        Delete <RiDeleteBinFill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Ruang1;

