import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext.jsx"; // ✅ 전역 상태
import App from "./App.jsx"; // ✅ App 안에 <AppRouter /> 있음
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SearchProvider>      {/* ✅ 1. 전역 상태 */}
      <BrowserRouter>     {/* ✅ 2. 라우터 */}
        <App />           {/* ✅ 3. 실제 앱 구조 */}
      </BrowserRouter>
    </SearchProvider>
  </React.StrictMode>
);
