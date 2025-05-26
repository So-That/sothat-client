import { Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home";
import Search from "./pages/Search";
import AnalyzeURL from "./pages/AnalyzeURL";
import AnalyzeKeyword from "./pages/AnalyzeKeyword";
import AnalyzeKeywordResult from "./pages/AnalyzeKeywordResult";
import AnalyzeResult from "./pages/AnalyzeResult"; // ✅ 추가

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/analyze/url" element={<AnalyzeURL />} />
      <Route path="/analyze/keyword" element={<AnalyzeKeyword />} />
      <Route path="/analyze/keyword/result" element={<AnalyzeKeywordResult />} />
      <Route path="/analyze" element={<AnalyzeResult />} /> {/* ✅ 추가 */}
    </Routes>
  );
}

export default AppRouter;
