import Navbar from "../components/Navbar";
import SearchBox from "../components/SearchBox";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold">댓글에서 시작하는 똑똑한 소비</h2>
        <SearchBox />
        <p className="mt-4 text-gray-500">아래로 내려서 사용법 알아보기</p>
      </div>
    </div>
  );
}

export default Home;
