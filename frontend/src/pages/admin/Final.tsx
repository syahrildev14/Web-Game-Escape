import { useState, useRef } from "react";
import AdminLayout from "../../admin-layout/AdminLayout";

const Final = () => {
    const [codes, setCodes] = useState<string[]>(["", "", "", "", "", ""]);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newCodes = [...codes];
        newCodes[index] = value;
        setCodes(newCodes);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !codes[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleUpdate = async (): Promise<void> => {
        setMessage("");
        setError("");

        const newCode = codes.join("");

        if (!/^\d{6}$/.test(newCode)) {
            setError("Kode harus 6 digit angka");
            return;
        }

        setLoading(true);

        try {
            // 🔥 LOOP SIMPAN KE TIAP ROOM
            const requests = codes.map((code, index) => {
                const room = `room${index + 1}`;

                return fetch(
                    `http://localhost:5000/api/rooms/code/${room}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code }),
                    }
                );
            });

            const responses = await Promise.all(requests);

            // cek kalau ada yg gagal
            responses.forEach(async (res, index) => {
                if (!res.ok) {
                    const text = await res.text();
                    console.error(`Room ${index + 1} error:`, text);
                    throw new Error(`Gagal update room${index + 1}`);
                }
            });

            setMessage("Semua kode room berhasil diupdate ✅");
            setCodes(["", "", "", "", "", ""]);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-xl">
                <h1 className="text-2xl font-bold mb-4">
                    🔐 Pengaturan Kode Final
                </h1>

                <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                    <p className="text-gray-600">
                        Masukkan kode 6 digit (akan dibagi ke room 1–6).
                    </p>

                    {/* INPUT */}
                    <div className="flex gap-2 justify-between">
                        {codes.map((code, index) => (
                            <input
                                key={index}
                                type="text"
                                value={code}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                    handleBackspace(e, index)
                                }
                                maxLength={1}
                                className="w-12 h-14 text-center text-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}

                    {message && (
                        <p className="text-green-600 text-sm">{message}</p>
                    )}

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold duration-300 disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Update Kode"}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Final;