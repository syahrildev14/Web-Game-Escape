interface PuzzleModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col items-center"
        style={{
          width: "90vw",
          maxWidth: "900px",
          height: "80vh",
          maxHeight: "700px",
          padding: "20px",
        }}
      >
        <h2 className="text-xl font-bold mb-3">Puzzle Game</h2>

        <div style={{ width: "100%", height: "100%", borderRadius: "12px" }}>
          {children}
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-1/2 bg-red-600 text-white py-2 rounded-lg"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default PuzzleModal;
