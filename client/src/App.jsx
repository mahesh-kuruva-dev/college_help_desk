
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import FloatingChatButton from "./components/FloatingChatButton.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function WithNavbar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<WithNavbar><HomePage /></WithNavbar>}
        />
        <Route
          path="/login"
          element={<WithNavbar><LoginPage /></WithNavbar>}
        />
        <Route
          path="/signup"
          element={<WithNavbar><SignupPage /></WithNavbar>}
        />
        <Route
          path="/dashboard"
          element={<WithNavbar><DashboardPage /></WithNavbar>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <FloatingChatButton />
    </>
  );
}
