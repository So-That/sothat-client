import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center">
        {/* 왼쪽: 로고 */}
        <Link to="/" className="text-[#F44F49] text-2xl font-bold">
          So That
        </Link>

        {/* 오른쪽: 메뉴 */}
        <div className="flex items-center space-x-10 text-lg text-gray-800">
          {/* analyze 클릭시 이동 */}
          <Link
            to="/search"
            className="cursor-pointer hover:text-black transition"
          >
            analyze
          </Link>

          <Link to="/notice" className="hover:text-black transition">
            notice
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
