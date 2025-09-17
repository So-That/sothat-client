import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSearch } from "../context/SearchContext.jsx";

function Search() {
  const { input, setInput } = useSearch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center pt-30 px-4">
        {/* STEP 1 */}
        <h2 className="text-2xl font-bold mb-4 text-[#F3284C]">
          STEP1. <span className="text-black">분석할 제품을 입력하세요</span>
        </h2>
        <div className="flex items-center w-full max-w-xl border-4 border-[#F3284C] rounded-full px-6 py-3 mb-12">
          <span className="text-[#F3284C] text-2xl mr-4">🔍</span>
          <input
            type="text"
            placeholder="예: 아이폰16"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-lg outline-none"
          />
        </div>

        {/* STEP 2 → input 있을 때만 보이게 */}
        {input.trim().length > 0 && (
          <>
            <hr className="w-full max-w-xl border-t border-gray-200 mb-12" />

            <h2 className="text-2xl font-bold mb-6 text-[#F3284C]">
              STEP2. <span className="text-black">어떤 방식으로 분석할까요?</span>
            </h2>

            <div className="flex flex-col gap-4 w-full max-w-xl">
              <button
                onClick={() => navigate("/analyze/url")}
                className="w-full flex justify-between items-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                <span className="flex items-center gap-2 font-medium">🔗 URL 붙여넣기</span>
                <span className="text-sm text-gray-500">
                  직접 알고 있는 영상 URL을 넣어주세요
                </span>
              </button>

              <button
                onClick={() => navigate("/analyze/keyword")}
                className="w-full flex justify-between items-center px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                <span className="flex items-center gap-2 font-medium">⌨️ 유튜브 검색하기</span>
                <span className="text-sm text-gray-500">
                  유튜브에서 검색 후 영상을 선택하세요
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
