import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../admin-layout/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";

const AdminVideo = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/videos/intro")
      .then((res) => {
        if (res.data) setVideoUrl(res.data.url);
      })
      .catch((err) => console.error(err));
  }, []);

  const convertToEmbed = (url: string) => {
    if (!url) return "";

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  const handleSave = async () => {
    try {
      const embedUrl = convertToEmbed(videoUrl);

      await axios.put(
        "http://localhost:5000/api/videos/intro",
        { url: embedUrl }
      );

      setVideoUrl(embedUrl);

      // 🔥 tampilkan animasi sukses
      setShowSuccess(true);

      // hilang otomatis setelah 2 detik
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 relative">
        <h1 className="text-2xl font-bold mb-4">
          Kelola Video Intro
        </h1>

        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Paste link YouTube (watch / youtu.be)"
        />

        <button
          onClick={handleSave}
          className="mt-4 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
        >
          Simpan
        </button>

        {/* 🔥 Animasi Success */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              ✅ Video berhasil diperbarui!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminVideo;