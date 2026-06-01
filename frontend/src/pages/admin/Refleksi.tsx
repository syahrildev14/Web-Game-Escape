import { useEffect, useState } from "react";
import AdminLayout from "../../admin-layout/AdminLayout";

interface Reflection {
    id: number;
    player_name: string;
    learned: string;
    challenge_text: string;
    strategy: string;
    rating: number;
    created_at: string;
}

export default function AdminReflections() {
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/reflections")
            .then((res) => res.json())
            .then((data) => {
                setReflections(data.data || data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Data Refleksi Pemain
                </h1>

                <p className="mt-4">Memuat data...</p>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">
                        Refleksi Pemain
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Daftar refleksi yang dikirim pemain setelah
                        menyelesaikan game.
                    </p>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-violet-600 text-white">
                            <tr>
                                <th className="p-3 text-left">No</th>
                                <th className="p-3 text-left">Nama Pemain</th>
                                <th className="p-3 text-left">Pembelajaran</th>
                                <th className="p-3 text-left">Tantangan</th>
                                <th className="p-3 text-left">Strategi</th>
                                <th className="p-3 text-center">Rating</th>
                                <th className="p-3 text-left">Tanggal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reflections.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Belum ada data refleksi
                                    </td>
                                </tr>
                            ) : (
                                reflections.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3">{index + 1}</td>

                                        <td className="p-3 font-medium">
                                            {item.player_name}
                                        </td>

                                        <td className="p-3 max-w-xs">
                                            {item.learned}
                                        </td>

                                        <td className="p-3 max-w-xs">
                                            {item.challenge_text}
                                        </td>

                                        <td className="p-3 max-w-xs">
                                            {item.strategy}
                                        </td>

                                        <td className="p-3 text-center">
                                            ⭐ {item.rating}
                                        </td>

                                        <td className="p-3">
                                            {new Date(
                                                item.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );

}