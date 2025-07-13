// src/pages/AnalyzeResult.jsx

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AnalyzeResultTop from "../components/AnalyzeResultTop";
import AnalyzeResultContent from "../components/AnalyzeResultContent";

function AnalyzeResult() {
  const location = useLocation();
  const { urls, keyword } = location.state || {};

  useEffect(() => {
    console.log("useEffect 실행됨! urls:", urls, "keyword:", keyword);

    if (!urls || urls.length === 0) {
      console.log("urls가 비어있어서 fetch를 하지 않습니다.");
      return;
    }

    const fetchAnalysis = async () => {
      try {
        console.log("fetchAnalysis 호출!");
        const res = await fetch("http://localhost:8080/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, urls }),
        });

        if (!res.ok) {
          throw new Error("서버가 응답하지 않거나 에러가 발생했습니다.");
        }

        const data = await res.json();
        console.log("분석 결과(data):", data);
        // TODO: setState 해서 결과를 AnalyzeResultTop/Content에 내려주면 됨
      } catch (err) {
        console.error("분석 요청 실패:", err);
      }
    };

    fetchAnalysis();
  }, [urls, keyword]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AnalyzeResultTop />
      <AnalyzeResultContent />
    </div>
  );
}

export default AnalyzeResult;
