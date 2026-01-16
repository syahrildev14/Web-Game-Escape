import { useState } from "react";
import axios from "axios";

export default function AdminRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        if (password !== confirm) {
            setError("Password tidak sama");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password,
            });

            setSuccess("Register berhasil! Silahkan login.");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Register gagal!");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-950 via-blue-400 to-violet-500 p-4">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-lg rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Admin Register
                </h2>

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-gray-600 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
                            placeholder="Nama admin"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
                            placeholder="admin@mail.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
                            placeholder="•••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Konfirmasi Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
                            placeholder="•••••••"
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-600 text-sm">{success}</p>}

                    <p className="text-center text-sm mt-3 text-gray-800">
                        Sudah punya akun?{" "}
                        <a href="/login" className="font-semibold underline">
                            Login disini
                        </a>
                    </p>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
