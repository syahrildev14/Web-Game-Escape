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
      .get("http://localhost:5000/api/results/room/kovalen")
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
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold mb-4">📊 Ruang Kovalen — Hasil Pemain</h1>
          {/* Search */}
          <input
            placeholder="Cari nama..."
            className="border px-3 py-2 rounded shadow-lg w-1/5 outline-none focus:ring-1 focus:ring-blue-500"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full border shadow rounded-lg overflow-hidden">
          <thead className="bg-violet-600 text-white select-none">
            <tr>
              <th className="px-3 py-2 text-center">No</th>
              <th
                className="px-3 py-2 text-center cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Nama {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
              </th>

              <th
                className="px-3 py-2 text-center cursor-pointer"
                onClick={() => handleSort("pre")}
              >
                Pre {sortField === "pre" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
              </th>

              <th
                className="px-3 py-2 text-center cursor-pointer"
                onClick={() => handleSort("post")}
              >
                Post {sortField === "post" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
              </th>

              <th
                className="px-3 py-2 text-center cursor-pointer"
                onClick={() => handleSort("delta")}
              >
                Peningkatan {sortField === "delta" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
              </th>

              <th
                className="px-3 py-2 text-center cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Tanggal {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
              </th>
              <th className="px-3 py-2 text-center">Aksi</th>

            </tr>
          </thead>


          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-100">
                <td className="px-3 py-2 text-center">{i + 1}</td>
                <td className="px-3 py-2">{row.playerName}</td>
                <td className="px-3 py-2 text-center">{row.pretestScore}</td>
                <td className="px-3 py-2 text-center">{row.posttestScore}</td>
                <td className="px-3 py-2 text-center text-blue-600 font-semibold">
                  {row.posttestScore - row.pretestScore}
                </td>
                <td className="px-3 py-2 text-center">
                  {new Date(row.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-3 py-2 flex justify-center items-center">
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-2"
                    onClick={() => handleDelete((row as any)._id)}
                  >
                    Delete <RiDeleteBinFill />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </AdminLayout>
  );
};

export default Ruang1;

