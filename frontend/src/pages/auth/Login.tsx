import { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });
            localStorage.setItem("token", res.data.token);
            window.location.href = "/admin/dashboard";
        } catch (err: any) {
            setError(err.response?.data?.message || "Login gagal!");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-violet-950 via-blue-400 to-violet-500 p-4">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-lg rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Admin Login
                </h2>

                <form className="space-y-4" onSubmit={handleLogin}>
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

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <p className="text-center text-sm mt-3 text-gray-800">
                        Belum punya akun?{" "}
                        <a href="/register" className="font-semibold underline">
                            Register disini
                        </a>
                    </p>


                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
