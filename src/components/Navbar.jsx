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
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
        {/* 왼쪽: 로고 */}
        <Link to="/" className="text-[#F44F49] text-2xl font-bold">
          So That
        </Link>

        {/* 오른쪽: 메뉴 */}
        <div className="flex items-center space-x-10 text-lg text-gray-800">
          {/* analyze 메뉴 */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="cursor-pointer hover:text-black transition">
              analyze
            </span>

            {showMenu && (
              <div className="absolute left-0 top-full mt-3 z-20">
                <div className="w-3 h-3 bg-gray-100 rotate-45 absolute top-0 left-6 -translate-y-1/2 shadow" />
                <div className="bg-gray-100 rounded-lg shadow-lg p-3 w-56 text-sm">
                  <Link
                    to="/analyze/url"
                    className="block px-4 py-2 rounded hover:bg-white"
                  >
                    🔗 URL로 분석하기
                  </Link>
                  <Link
                    to="/analyze/keyword"
                    className="block px-4 py-2 rounded hover:bg-white"
                  >
                    ⌨️ 키워드로 분석하기
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/notice" className="hover:text-black transition">
            notice
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
