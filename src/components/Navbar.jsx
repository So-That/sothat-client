import { Link } from "react-router-dom";
import { useState, useRef } from "react";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    // 메뉴를 바로 닫지 말고, 딜레이 줘서 사용자가 메뉴에 도달할 시간 확보
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200); // ← 여유 시간 0.2초
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b relative">
      <Link to="/" className="text-red-500 text-2xl font-bold">
        Capstone
      </Link>

      <div className="flex items-center space-x-6">
        {/* 전체 메뉴 영역에 마우스 이벤트 적용 */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="font-bold cursor-pointer">analyze</span>

          {showMenu && (
            <div className="absolute right-0 top-full mt-3 z-10">
              {/* 꼭지 */}
              <div className="w-3 h-3 bg-gray-100 rotate-45 absolute top-0 right-4 -translate-y-1/2 shadow" />

              {/* 드롭다운 박스 */}
              <div className="bg-gray-100 rounded-lg shadow-lg p-2 w-48">
                <Link
                  to="/analyze/url"
                  className="block px-4 py-2 hover:bg-white rounded"
                >
                  🔗 URL로 분석하기
                </Link>
                <Link
                  to="/analyze/keyword"
                  className="block px-4 py-2 hover:bg-white rounded"
                >
                  ⌨️ 키워드로 분석하기
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link to="/notice" className="font-bold">notice</Link>
      </div>
    </nav>
  );
}

export default Navbar;
