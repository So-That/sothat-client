import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSearch } from "../context/SearchContext.jsx";

function AnalyzeKeyword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { input } = useSearch();

  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(false);

  const handleSearch = () => {
    const finalKeyword =
      keyword.trim() ||
      (typeof location.state?.input === "string" ? location.state.input.trim() : "") ||
      input?.trim();

    if (!finalKeyword || finalKeyword.length < 2) {
      setError(true);
      return;
    }

    setError(false);
    console.log("검색 키워드:", finalKeyword);

    navigate(`/analyze/keyword/result?query=${encodeURIComponent(finalKeyword)}`);
  };

  return (
    <div className="relative min-h-screen pb-28">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-30 px-4">
        <h2 className="text-2xl font-bold mb-1">
          ⌨️ {input?.trim().length > 0 ? `"${input}" 유튜브 검색하기` : "유튜브 검색하기"}
        </h2>
        <p className="text-gray-600 mb-4">유튜브에서 검색 후 분석할 영상을 선택하세요!</p>
        <div className="border-b-2 border-neutral-500 w-full mb-6"></div>

        {/* 입력창 */}
<div className="flex items-center w-full max-w-2xl border border-gray-300 rounded-full overflow-hidden shadow-sm">
  <input
    type="text"
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    placeholder="YouTube에서 검색 (예: 아이폰 16 리뷰)"
    className="flex-1 px-4 py-3 outline-none text-gray-700"
  />
  <button
    onClick={handleSearch}
    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition flex items-center"
  >
    🔍
  </button>
</div>


        {error && (
          <p className="text-sm text-red-500 ml-2 mb-4">검색어를 입력해주세요.</p>
        )}
      </div>

      {/* CTA 버튼 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={handleSearch}
          className="bg-red-500 text-white px-10 py-3 rounded-full shadow-md hover:bg-red-600 transition text-lg"
        >
          유튜브 검색하기 →
        </button>
      </div>
    </div>
  );
}

export default AnalyzeKeyword;
