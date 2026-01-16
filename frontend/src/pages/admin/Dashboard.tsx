import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../admin-layout/AdminLayout";

interface Ranking {
  playerName: string;
  totalAvg: number;
}

const Dashboard = () => {
  const [ranking, setRanking] = useState<Ranking[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/results/ranking/global")
      .then(res => setRanking(res.data))
      .catch(err => console.error(err));
  }, []);

  const medals = ["🥇", "🥈", "🥉"];
  const colors = ["bg-yellow-400", "bg-gray-300", "bg-orange-300"];

  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🏆 Peringkat Global
        </h1>

        {/* Top 3 Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {top3.length === 0 && (
            <p className="text-gray-500">Belum ada data 😢</p>
          )}

          {top3.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl shadow-lg p-4 text-center text-black ${colors[i]}`}
            >
              <div className="text-4xl">{medals[i]}</div>
              <div className="text-xl font-semibold mt-2">{p.playerName}</div>
              <div className="text-lg mt-1 text-blue-700 font-bold">
                {p.totalAvg.toFixed(1)}
              </div>
              <div className="text-sm opacity-70">Rata-rata Global</div>
            </div>
          ))}
        </div>

        {/* Others Table */}
        {others.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Peringkat Lainnya</h2>
            <table className="w-full border shadow rounded-lg overflow-hidden">
              <thead className="bg-violet-600 text-white">
                <tr>
                  <th className="px-3 py-2 text-center">Rangking</th>
                  <th className="px-3 py-2 text-left">Nama</th>
                  <th className="px-3 py-2 text-center">Rata-rata</th>
                </tr>
              </thead>
              <tbody>
                {others.map((p, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-100">
                    <td className="px-3 py-2 text-center">{i + 4}</td>
                    <td className="px-3 py-2">{p.playerName}</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-600">
                      {p.totalAvg.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
