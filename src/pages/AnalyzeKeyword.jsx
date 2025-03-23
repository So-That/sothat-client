import { useState } from "react";
import Navbar from "../components/Navbar";

function AnalyzeKeyword() {
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(false);

  const handleSearch = () => {
    if (keyword.trim().length < 2) {
      setError(true);
      return;
    }
    
    setError(false);
    console.log("검색 키워드:", keyword.trim());
    // API 호출 or 이동
  };

  return (
    <div className="relative min-h-screen pb-28">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-30 px-4">
        <h2 className="text-2xl font-bold mb-1">⌨️ 키워드로 분석하기</h2>
        <p className="text-gray-600 mb-4">
          검색을 통해 분석할 영상을 골라보세요!
        </p>
        <div className="border-b-2 border-neutral-500 w-full mb-6"></div>
      
        {/* 입력창 */}
        <div className="flex items-center space-x-2 mb-4 relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="검색어를 입력하세요"
            className={`flex-1 h-14 border-2 px-4 py-2 pr-10 rounded-full ${
              error ? "border-red-500" : "border-red-400"
            }`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none">
            🔍
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 ml-2 mb-4">
            검색어를 입력해주세요.
          </p>
        )}
      </div>

      {/* 고정된 버튼 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={handleSearch}
          className="bg-neutral-500 text-white px-10 py-3 rounded-full shadow-md hover:bg-neutral-600 transition text-lg"
        >
          검색하기 →
        </button>
      </div>
    </div>
  );
}

export default AnalyzeKeyword;
