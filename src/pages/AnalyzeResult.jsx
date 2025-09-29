// src/pages/AnalyzeResult.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AnalyzeResultTop from "../components/AnalyzeResultTop";
import AnalyzeResultContent from "../components/AnalyzeResultContent";
import mockAnalysis from "../mock/analyzeResult.json";

// ✅ 모크 우선 사용: true -> 목 사용, false -> 백엔드 POST /summary 사용
const USE_MOCK = false;

function AnalyzeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { urls = [], keyword = "" } = location.state || {};

  const [analysis, setAnalysis] = useState(null); // {제품명, 카테고리별요약, 전체요약, 비교, total_sentiment_count, category_sentiment_count}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 라우팅 파라미터 유효성 체크(선택)
  useEffect(() => {
    if (!USE_MOCK && (!urls || urls.length === 0)) {
      console.warn("urls가 없어 라이브 호출을 생략합니다.");
      // navigate("/"); // 필요시 활성화
    }
  }, [urls]);

  useEffect(() => {
    const ctrl = new AbortController();

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        if (USE_MOCK) {
          setAnalysis(normalizeApiResponse(mockAnalysis, keyword));
          return;
        }

        // ✅ 백엔드 연동 (새 스키마 대응)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/summary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, urls }),
          signal: ctrl.signal,
        });

        if (!res.ok) throw new Error((await res.text()) || "서버 에러");

        const raw = await res.json();
        const normalized = normalizeApiResponse(raw, keyword);
        setAnalysis(normalized);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError(e.message || "분석 요청 실패");
        }
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ctrl.abort();
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

/* ----------------------- helpers ----------------------- */

/**
 * 백엔드 응답(단일 객체 or 배열)을 프론트가 쓰는 스키마로 정규화
 * 기대 출력:
 * {
 *   제품명, 카테고리별요약, 전체요약, 비교,
 *   total_sentiment_count, category_sentiment_count
 * }
 */
function normalizeApiResponse(raw, fallbackKeyword = "") {
  const list = Array.isArray(raw) ? raw : [raw];
  const merged = mergeObjects(list);

  // 🔹 제품명: gpt_reviews > 제품명 → target_product → fallback
  const productName =
    merged?.gpt_reviews?.["제품명"] ||
    merged["제품명"] ||
    merged["target_product"] ||
    fallbackKeyword ||
    "제품";

  // 🔹 감정 카운트: meta_info 우선
  const totalSent =
    merged?.meta_info?.total_sentiment_count ||
    merged["total_sentiment_count"] ||
    {};

  const categorySent =
    merged?.meta_info?.category_sentiment_count ||
    merged["category_sentiment_count"] ||
    {};

  // 🔹 카테고리별 요약: gpt_reviews > 카테고리별요약 → (없으면 reviews로 간단 요약)
  const categorySummaries =
    merged?.gpt_reviews?.["카테고리별요약"] ||
    merged["카테고리별요약"] ||
    buildSummariesFromReviews(merged["category_reviews"]);

  // 🔹 전체 요약/비교: gpt_reviews 우선
  const overallSummary =
    merged?.gpt_reviews?.["전체요약"] ||
    merged["전체요약"] ||
    buildOverall(totalSent, categorySummaries);

  const compareNote =
    merged?.gpt_reviews?.["비교"] ||
    merged["비교"] ||
    "";

  return {
    제품명: productName,
    카테고리별요약: categorySummaries,
    전체요약: overallSummary,
    비교: compareNote,
    total_sentiment_count: normalizeSentimentKeys(totalSent),
    category_sentiment_count: normalizeCategorySentimentKeys(categorySent),
  };
}

function mergeObjects(arr) {
  const out = {};
  for (const obj of arr) {
    if (!obj || typeof obj !== "object") continue;
    for (const [k, v] of Object.entries(obj)) {
      // 중첩 객체는 얕게 병합 (필요 부분만)
      if (k === "meta_info" && typeof v === "object") {
        out.meta_info = { ...(out.meta_info || {}), ...v };
      } else if ((k === "category_reviews" || k === "카테고리별요약") && typeof v === "object") {
        out[k] = { ...(out[k] || {}), ...v };
      } else if (
        k === "total_sentiment_count" ||
        k === "category_sentiment_count"
      ) {
        out[k] = { ...(out[k] || {}), ...v };
      } else {
        out[k] = v;
      }
    }
  }
  return out;
}

function buildSummariesFromReviews(categoryReviews = {}) {
  const summaries = {};
  for (const [cat, arr] of Object.entries(categoryReviews || {})) {
    if (!Array.isArray(arr) || arr.length === 0) {
      summaries[cat] = "";
      continue;
    }
    // 상위 3~5개 문장 간단 요약(이어붙이기)
    const joined = arr
      .slice(0, 5)
      .map((s) =>
        String(s || "")
          .replace(/<br\s*\/?>/gi, " ")
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(Boolean)
      .join(" · ");
    summaries[cat] = joined;
  }
  return summaries;
}

function buildOverall(totalSent = {}, catSummaries = {}) {
  const t = normalizeSentimentKeys(totalSent);
  const pos = t.POSITIVE || 0;
  const neg = t.NEGATIVE || 0;
  const neu = t.NEUTRAL || 0;
  const mix = t.MIXED || 0;
  const sum = Math.max(1, pos + neg + neu + mix);
  const posP = Math.round((pos * 100) / sum);
  const negP = Math.round((neg * 100) / sum);

  // 간단한 한 줄 요약 + 주요 카테고리 2~3개 하이라이트
  const topCats = Object.entries(catSummaries)
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${truncate(v, 60)}`)
    .join(" / ");

  return `전반적으로 ${posP}% 긍정, ${negP}% 부정의 반응이 관찰됩니다. 주요 카테고리: ${topCats}`;
}

function truncate(s = "", n = 60) {
  return s.length <= n ? s : s.slice(0, n) + "...";
}

function normalizeSentimentKeys(obj = {}) {
  // 키를 대문자 4종으로 정규화
  const map = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0, MIXED: 0 };
  for (const [k, v] of Object.entries(obj)) {
    const key = toSentKey(k);
    map[key] = (map[key] || 0) + Number(v || 0);
  }
  return map;
}

function toSentKey(k = "") {
  const u = String(k).toUpperCase();
  if (u.includes("POS") || u === "긍정") return "POSITIVE";
  if (u.includes("NEG") || u === "부정") return "NEGATIVE";
  if (u.includes("NEU") || u === "중립") return "NEUTRAL";
  if (u.includes("MIX") || u === "혼합") return "MIXED";
  return ["POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"].includes(u) ? u : "NEUTRAL";
}

function normalizeCategorySentimentKeys(catSent = {}) {
  const out = {};
  for (const [cat, counts] of Object.entries(catSent || {})) {
    out[cat] = normalizeSentimentKeys(counts || {});
  }
  return out;
}
