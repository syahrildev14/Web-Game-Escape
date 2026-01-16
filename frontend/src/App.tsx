import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RoomIon from "./pages/RoomIon";
import RoomKovalen from "./pages/RoomKovalen";
import RoomElektro from "./pages/RoomElectronegativity";
import RoomLewis from "./pages/RoomLewis";
import RoomLogam from "./pages/RoomLogam";
import RoomGaya from "./pages/RoomGaya";
import Final from "./pages/Final";
import Refleksi from "./pages/Refleksi";
// import SplashCursor from "./components/SplashCursor";
// import Backsound from "./components/Backsound";
// Admin
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import RequireAuth from "./components/auth/RequireAuth";
import Ruang1 from "./pages/admin/Ruang1";
import Ruang2 from "./pages/admin/Ruang2";
import Ruang3 from "./pages/admin/Ruang3";
import Ruang4 from "./pages/admin/Ruang4";
import Ruang5 from "./pages/admin/Ruang5";
import Ruang6 from "./pages/admin/Ruang6";
import Dashboard from "./pages/admin/Dashboard";


function App() {
  return (
    <BrowserRouter>
      {/* <SplashCursor /> */}
      {/* <Backsound /> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ion" element={<RoomIon />} />
        <Route path="/kovalen" element={<RoomKovalen />} />
        <Route path="/elektro" element={<RoomElektro />} />
        <Route path="/lewis" element={<RoomLewis />} />
        <Route path="/logam" element={<RoomLogam />} />
        <Route path="/gaya" element={<RoomGaya />} />
        <Route path="/final" element={<Final />} />
        <Route path="/refleksi" element={<Refleksi />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {/* Admin Page */}
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/ruang-1"
          element={
            <RequireAuth>
              <Ruang1 />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/ruang-2"
          element={
            <RequireAuth>
              <Ruang2 />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/ruang-3"
          element={
            <RequireAuth>
              <Ruang3 />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/ruang-4"
          element={
            <RequireAuth>
              <Ruang4 />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/ruang-5"
          element={
            <RequireAuth>
              <Ruang5 />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/ruang-6"
          element={
            <RequireAuth>
              <Ruang6 />
            </RequireAuth>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
