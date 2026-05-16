import React, { useState } from "react";
import type { Question } from "../types/question";

type ReviewItem = {
  question: string;
  selected: number;
  correct: number;
  isCorrect: boolean;
};

interface MultipleChoiceModalProps {
  title: string;
  questions: Question[];
  onClose: () => void;
  onSubmit: (data: {
    score: number;
    answers: number[];
    reviewData: ReviewItem[];
  }) => void;
}

const MultipleChoiceModal: React.FC<MultipleChoiceModalProps> = ({
  title,
  questions,
  onClose,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<number[]>(
    questions.map(() => -1)
  );

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

    const reviewData: ReviewItem[] = questions.map((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;

      if (isCorrect) correct++;

      return {
        question: q.question,
        selected: answers[index],
        correct: q.correctAnswer,
        isCorrect,
      };
    });

    const score = Math.round(
      (correct / questions.length) * 100
    );

    onSubmit({
      score,
      answers,
      reviewData,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-center">
            {title}
          </h2>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50">

              <p className="font-semibold text-sm sm:text-base mb-4 leading-relaxed">
                {qIndex + 1}. {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((opt, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition"
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answers[qIndex] === optIndex}
                      onChange={() => selectAnswer(qIndex, optIndex)}
                      className="mt-1 shrink-0"
                    />

                    <span className="text-sm sm:text-base leading-relaxed break-words">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-6 border-t bg-white flex flex-col sm:flex-row gap-3 justify-between">

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg transition font-semibold"
          >
            Tutup
          </button>

          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition font-semibold"
          >
            Kirim Jawaban
          </button>

        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceModal;