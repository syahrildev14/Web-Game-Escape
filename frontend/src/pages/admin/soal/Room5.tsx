import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../../admin-layout/AdminLayout";

interface Question {
  id: number;
  room: string;
  type: "pretest" | "posttest";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuestionForm {
  room: string;
  type: "pretest" | "posttest";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Room5 = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [form, setForm] = useState<QuestionForm>({
    room: "logam",
    type: "pretest",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  // =============================
  // FETCH DATA
  // =============================
  const fetchQuestions = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/questions/logam"
    );

    const combined = [...res.data.pretest, ...res.data.posttest];
    setQuestions(combined);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // =============================
  // HANDLE INPUT
  // =============================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (value: string, index: number) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/questions", {
      ...form,
      correctAnswer: Number(form.correctAnswer),
      explanation: form.explanation || "",
    });

    setForm({
      room: "logam",
      type: "pretest",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });

    fetchQuestions();
  };

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/questions/${id}`);
    fetchQuestions();
  };

  return (
    <AdminLayout>
      <div className="p-6 text-black">
        <h1 className="text-2xl font-bold mb-6">
          Kelola Soal Ruang Logam
        </h1>

        {/* =============================
            FORM TAMBAH SOAL
        ============================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
        >
          <div>
            <label className="font-semibold">Tipe Soal</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="pretest">Pretest</option>
              <option value="posttest">Posttest</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Pertanyaan</label>
            <input
              type="text"
              name="question"
              value={form.question}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          {form.options.map((opt, index) => (
            <div key={index}>
              <label className="font-semibold">
                Opsi {index + 1}
              </label>
              <input
                type="text"
                value={opt}
                onChange={(e) =>
                  handleOptionChange(e.target.value, index)
                }
                className="w-full border p-2 rounded mt-1"
                required
              />
            </div>
          ))}

          <div>
            <label className="font-semibold">
              Jawaban Benar (0-3)
            </label>
            <input
              type="number"
              name="correctAnswer"
              min={0}
              max={3}
              value={form.correctAnswer}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          {/* 🔥 EXPLANATION SELALU ADA */}
          <div>
            <label className="font-semibold">
              Explanation (Opsional untuk Postest)
            </label>
            <textarea
              name="explanation"
              value={form.explanation}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800 transition"
          >
            Tambah Soal
          </button>
        </form>

        {/* =============================
            LIST SOAL
        ============================= */}
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    [{q.type}] {q.question}
                  </p>

                  <ul className="list-disc ml-5 text-sm mt-2">
                    {q.options.map((opt, i) => (
                      <li key={i}>
                        {opt}{" "}
                        {q.correctAnswer === i && (
                          <span className="text-green-600 font-bold">
                            (Benar)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* 🔥 TAMPILKAN EXPLANATION */}
                  {q.explanation && (
                    <p className="text-blue-600 text-sm mt-2">
                      Penjelasan: {q.explanation}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Room5;