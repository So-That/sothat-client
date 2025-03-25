import Navbar from "../components/Navbar";
import { FaSearch } from "react-icons/fa";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-white px-4 pt-50">
        <div className="flex flex-row items-center justify-center gap-16">
          {/* 왼쪽 텍스트 */}
          <div className="text-left">
            <h2 className="text-4xl font-extrabold leading-relaxed">
              댓글에서 시작하는 <br />
              똑똑한{" "}
              <span className="bg-[#FFE062] px-2">소비</span>
            </h2>
          </div>

          {/* 오른쪽 검색창 */}
          <div className="w-[500px]">
            <div className="flex items-center h-[60px] border-[3px] border-[#FF0032] rounded-full px-6">
              <FaSearch className="text-[#FF0032] text-2xl mr-3" />
              <input
                type="text"
                placeholder="검색어 입력..."
                className="h-full w-full text-lg outline-none placeholder-gray-400"
              />
  </div>
</div>

        </div>

        {/* 아래 안내 */}
        <p className="mt-80 text-sm text-black font-medium">
          아래로 내려서 사용법 알아보기
        </p>
        <div className="text-2xl mt-1">⬇️</div>
      </div>
    </div>
  );
}

export default Home;
