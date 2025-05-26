import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSearch } from "../context/SearchContext.jsx"; // ✅ 전역 상태 import

function Search() {
  const { input, setInput } = useSearch(); // ✅ useState 대신 사용
  const navigate = useNavigate();

  const goToKeywordAnalysis = () => {
    navigate("/analyze/keyword");
  };

  const goToURLAnalysis = () => {
    navigate("/analyze/url");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center pt-40 px-4">
        <h2 className="text-xl font-semibold mb-6">분석하고 싶은 제품을 입력하세요</h2>

        {/* 🔍 검색창 */}
        <div className="flex items-center w-full max-w-xl border-4 border-[#F3284C] rounded-full px-6 py-3">
          <span className="text-[#F3284C] text-2xl mr-4">🔍</span>
          <input
            type="text"
            placeholder="예: 아이폰16"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-lg outline-none"
          />
        </div>

        {/* 하단 버튼: 조건부 렌더링 */}
        {input.trim().length > 0 && (
          <div className="mt-10 flex gap-4">
            <button
              onClick={goToURLAnalysis}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              🔗 URL로 분석하기 <span>→</span>
            </button>

            <button
              onClick={goToKeywordAnalysis}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              ⌨️ 키워드로 분석하기 <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
