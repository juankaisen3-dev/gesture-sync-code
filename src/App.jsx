import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GestureRecognitionPage from "@/components/pages/GestureRecognitionPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white font-body">
        <Routes>
          <Route path="/" element={<GestureRecognitionPage />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;