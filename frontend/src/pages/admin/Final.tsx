import { useState, useRef } from "react";
import AdminLayout from "../../admin-layout/AdminLayout";

const Final = () => {
    const [codes, setCodes] = useState<string[]>([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const [message, setMessage] =
        useState<string>("");

    const [error, setError] =
        useState<string>("");

    const [loading, setLoading] =
        useState<boolean>(false);

    const inputsRef = useRef<
        (HTMLInputElement | null)[]
    >([]);

    const handleChange = (
        value: string,
        index: number
    ) => {
        if (!/^\d?$/.test(value)) return;

        const newCodes = [...codes];

        newCodes[index] = value;

        setCodes(newCodes);

        // AUTO NEXT INPUT
        if (value && index < 5) {
            inputsRef.current[
                index + 1
            ]?.focus();
        }
    };

    const handleBackspace = (
        e: React.KeyboardEvent,
        index: number
    ) => {
        if (
            e.key === "Backspace" &&
            !codes[index] &&
            index > 0
        ) {
            inputsRef.current[
                index - 1
            ]?.focus();
        }
    };

    const handleUpdate =
        async (): Promise<void> => {
            setMessage("");
            setError("");

            const newCode =
                codes.join("");

            if (
                !/^\d{6}$/.test(newCode)
            ) {
                setError(
                    "Kode harus 6 digit angka"
                );

                return;
            }

            setLoading(true);

            try {
                // UPDATE ROOM
                const requests =
                    codes.map(
                        (
                            code,
                            index
                        ) => {
                            const room = `room${index + 1
                                }`;

                            return fetch(
                                `http://localhost:5000/api/rooms/code/${room}`,
                                {
                                    method:
                                        "PUT",

                                    headers:
                                    {
                                        "Content-Type":
                                            "application/json",
                                    },

                                    body: JSON.stringify(
                                        {
                                            code,
                                        }
                                    ),
                                }
                            );
                        }
                    );

                const responses =
                    await Promise.all(
                        requests
                    );

                responses.forEach(
                    async (
                        res,
                        index
                    ) => {
                        if (!res.ok) {
                            const text =
                                await res.text();

                            console.error(
                                `Room ${index +
                                1
                                } error:`,
                                text
                            );

                            throw new Error(
                                `Gagal update room${index +
                                1
                                }`
                            );
                        }
                    }
                );

                setMessage(
                    "Semua kode room berhasil diupdate ✅"
                );
            } catch (err: any) {
                setError(
                    err.message ||
                    "Terjadi kesalahan"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <AdminLayout>
            <div
                className="
                    w-full
                    max-w-3xl
                    mx-auto

                    p-4
                    sm:p-6
                "
            >
                {/* TITLE */}
                <h1
                    className="
                        text-2xl
                        sm:text-3xl
                        font-bold

                        mb-6
                    "
                >
                    🔐 Pengaturan Kode Final
                </h1>

                {/* CARD */}
                <div
                    className="
                        bg-white
                        rounded-3xl
                        shadow-xl

                        p-5
                        sm:p-8

                        space-y-6
                    "
                >
                    {/* DESC */}
                    <p
                        className="
                            text-gray-600

                            text-sm
                            sm:text-base

                            leading-relaxed
                        "
                    >
                        Masukkan kode 6
                        digit untuk room
                        1–6.
                    </p>

                    {/* INPUT */}
                    <div
                        className="
                            grid
                            grid-cols-3
                            sm:grid-cols-6

                            gap-3
                            sm:gap-4
                        "
                    >
                        {codes.map(
                            (
                                code,
                                index
                            ) => (
                                <input
                                    key={
                                        index
                                    }
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={code}
                                    ref={(el) => {
                                        inputsRef.current[index] = el;
                                    }}
                                    onChange={(
                                        e
                                    ) =>
                                        handleChange(
                                            e
                                                .target
                                                .value,
                                            index
                                        )
                                    }
                                    onKeyDown={(
                                        e
                                    ) =>
                                        handleBackspace(
                                            e,
                                            index
                                        )
                                    }
                                    maxLength={
                                        1
                                    }
                                    className="
                                        w-full
                                        aspect-square

                                        text-center
                                        text-2xl
                                        sm:text-3xl
                                        font-bold

                                        border
                                        border-gray-300

                                        rounded-2xl

                                        focus:outline-none
                                        focus:ring-4
                                        focus:ring-blue-400/40
                                        focus:border-blue-500

                                        transition-all
                                    "
                                />
                            )
                        )}
                    </div>

                    {/* FINAL CODE */}
                    <div
                        className="
                            text-center
                            mt-2
                        "
                    >
                        <p
                            className="
                                text-sm
                                text-gray-500
                                mb-2
                            "
                        >
                            Kode Final
                        </p>

                        <div
                            className="
                                text-3xl
                                sm:text-5xl

                                font-bold

                                text-blue-800

                                tracking-widest
                                break-all
                            "
                        >
                            {codes.join(
                                ""
                            ) ||
                                "------"}
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            className="
                                bg-red-50
                                border
                                border-red-200

                                text-red-600

                                text-sm
                                sm:text-base

                                rounded-xl

                                px-4
                                py-3
                            "
                        >
                            {error}
                        </div>
                    )}

                    {/* SUCCESS */}
                    {message && (
                        <div
                            className="
                                bg-green-50
                                border
                                border-green-200

                                text-green-700

                                text-sm
                                sm:text-base

                                rounded-xl

                                px-4
                                py-3
                            "
                        >
                            {message}
                        </div>
                    )}

                    {/* BUTTON */}
                    <button
                        onClick={
                            handleUpdate
                        }
                        disabled={loading}
                        className="
                            w-full

                            bg-blue-800
                            hover:bg-blue-700

                            text-white

                            py-3
                            sm:py-4

                            rounded-2xl

                            font-semibold

                            text-sm
                            sm:text-lg

                            duration-300

                            disabled:opacity-50
                            disabled:cursor-not-allowed

                            shadow-lg
                        "
                    >
                        {loading
                            ? "Menyimpan..."
                            : "Update Kode"}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Final;