// src/pages/AnalyzeResult.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AnalyzeResultTop from "../components/AnalyzeResultTop";
import AnalyzeResultContent from "../components/AnalyzeResultContent";
import mockAnalysis from "../mock/analyzeResult.json";

// ✅ 모크 우선 사용: true -> 모크 사용, false -> 백엔드 POST /analyze 사용
const USE_MOCK = true;

function AnalyzeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { urls = [], keyword = "" } = location.state || {};

  const [analysis, setAnalysis] = useState(null); // {제품명, 카테고리별요약, 전체요약, 비교}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 라우팅 파라미터 유효성 체크(선택)
  useEffect(() => {
    if (!USE_MOCK && (!urls || urls.length === 0)) {
      // 분석 대상이 없으면 홈으로 보내거나 안내
      console.warn("urls가 없어 홈으로 이동합니다.");
      // navigate("/"); // 필요시 활성화
    }
  }, [urls]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");

      try {
        if (USE_MOCK) {
          // ✅ 모크 데이터 로딩
          setAnalysis(mockAnalysis);
          return;
        }

        // ✅ 백엔드 연동
        const res = await fetch("http://localhost:8080/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, urls }),
        });

        if (!res.ok) {
          throw new Error("서버가 응답하지 않거나 에러가 발생했습니다.");
        }

        const data = await res.json();
        // data는 다음 형태를 기대:
        // { 제품명, 카테고리별요약: {..}, 전체요약, 비교 }
        setAnalysis(data);
      } catch (e) {
        console.error(e);
        setError(e.message || "분석 요청 실패");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [keyword, urls]);

  // Top 컴포넌트에 넘길 메타 요약(필요시 확장)
  const topMeta = useMemo(() => {
    if (!analysis) return null;
    const categories = analysis["카테고리별요약"] || {};
    return {
      productName: analysis["제품명"] || keyword || "분석 결과",
      categoryCount: Object.keys(categories).length,
      hasCompare: Boolean(analysis["비교"]),
    };
  }, [analysis, keyword]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AnalyzeResultTop
        loading={loading}
        error={error}
        meta={topMeta}
        keyword={keyword}
      />
      <AnalyzeResultContent
        loading={loading}
        error={error}
        analysis={analysis}
      />
    </div>
  );
}

export default AnalyzeResult;
