import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnalyzeURL from "./pages/AnalyzeURL";
import AnalyzeKeyword from "./pages/AnalyzeKeyword";
import AnalyzeKeywordResult from "./pages/AnalyzeKeywordResult";


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze/url" element={<AnalyzeURL />} />
        <Route path="/analyze/keyword" element={<AnalyzeKeyword />} />
        <Route path="/analyze/keyword/result" element={<AnalyzeKeywordResult />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
