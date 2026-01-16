import React, { useState } from "react";
import type { Question } from "../types/question";

interface MultipleChoiceModalProps {
  title: string;
  questions: Question[];
  onClose: () => void;
  onSubmit: (data: { score: number; answers: number[] }) => void;
}



const MultipleChoiceModal: React.FC<MultipleChoiceModalProps> = ({
  title,
  questions,
  onClose,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<number[]>(questions.map(() => -1));

  const selectAnswer = (qIndex: number, optionIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers.includes(-1)) {
      alert("Semua soal harus dijawab!");
      return;
    }

    let correct = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / questions.length) * 100);

    onSubmit({
      score,
      answers,
    });

    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] shadow-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-5">
            <p className="font-semibold mb-2">{q.question}</p>

            {q.options.map((opt, optIndex) => (
              <label
                key={optIndex}
                className="flex items-center gap-2 mb-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  checked={answers[qIndex] === optIndex}
                  onChange={() => selectAnswer(qIndex, optIndex)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ))}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Tutup
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceModal;
