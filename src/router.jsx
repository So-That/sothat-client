import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnalyzeURL from "./pages/AnalyzeURL";
import AnalyzeKeyword from "./pages/AnalyzeKeyword";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze/url" element={<AnalyzeURL />} />
        <Route path="/analyze/keyword" element={<AnalyzeKeyword />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
