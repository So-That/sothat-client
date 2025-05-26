import { useLocation } from "react-router-dom";
import Navbar from "./Navbar"; // 경로 맞춰주세요

function AnalyzeResultTop() {
  const location = useLocation();
  const keyword = location.state?.keyword || "키워드";

  const scrollToSummary = () => {
    const target = document.getElementById("summary-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white pb-12">
      <Navbar />
      <div className="text-center pt-16 px-4">
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-gray-800">{`"`}</span>
          <span className="text-[#F44F49] font-extrabold">{keyword}</span>
          <span className="text-gray-800">{`"`}에 대한 분석 결과</span>
        </h2>
        <button
          onClick={scrollToSummary}
          className="mt-6 bg-[#F44F49] text-white px-6 py-3 rounded-full text-sm font-semibold shadow hover:bg-red-600 transition"
        >
          종합 의견 바로가기
        </button>
      </div>
    </div>
  );
}

export default AnalyzeResultTop;
