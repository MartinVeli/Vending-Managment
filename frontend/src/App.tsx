import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MachinesPage from "./pages/MachinesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import MachineFormPage from "./pages/MachineFormPage";
import MachineDetailsPage from "./pages/MachineDetailsPage";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
 <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "12px",
            padding: "14px 18px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/machines" element={<MachinesPage />} />
        <Route path="/machines/new" element={<MachineFormPage />} />
        <Route path="/machines/:id/edit" element={<MachineFormPage />} />
        <Route path="/machines/:id" element={<MachineDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}