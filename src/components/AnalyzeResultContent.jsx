import React, { useMemo } from "react";
import SentimentPieChart from "./SentimentPieChart";
import CategorySentimentBar from "./CategorySentimentBar";

function AnalyzeResultContent({ loading, error, analysis }) {
  const {
    sectionData, overallSummary, compareNote, totalSentiment, categorySentiment
  } = useMemo(() => {
    if (!analysis) {
      return { sectionData:{}, overallSummary:"", compareNote:"", totalSentiment:{}, categorySentiment:{} };
    }
    return {
      sectionData: analysis["카테고리별요약"] || {},
      overallSummary: analysis["전체요약"] || "",
      compareNote: analysis["비교"] || "",
      totalSentiment: analysis["total_sentiment_count"] || {},
      categorySentiment: analysis["category_sentiment_count"] || {},
    };
  }, [analysis]);

  // ...loading / error 처리 동일

  const keys = Object.keys(sectionData);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* 카테고리별 카드들 */}
      {keys.map((title, index) => {
        const counts = categorySentiment?.[title] || {};
        return (
          <div
            key={title}
            className="bg-white rounded-2xl shadow-md p-6 mb-10 border border-gray-200"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4">
                  <span className="text-red-500 font-black mr-2">{index + 1}</span>
                  {title}
                </h3>
                <p className="text-gray-700 text-s leading-relaxed whitespace-pre-line">
                  {sectionData[title]}
                </p>
              </div>

              <div className="w-full md:w-64 min-w-[220px] shrink-0">
                <SentimentPieChart
                  title="감정 분포"
                  counts={counts}
                  height={200}
                  donut
                  legend
                />
              </div>
            </div>
          </div>
        );
      })}

    {/* ✅ 전체 요약(차트 좌우, 텍스트 하단) */}
    {overallSummary && (
      <div
        id="summary-section"
        className="bg-white rounded-2xl shadow-md p-6 border border-gray-300"
      >
        <h3 className="text-xl font-bold mb-6">
          <span className="text-red-500 font-black mr-2">🧾</span>전체 요약
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 왼쪽: 전체 감정 도넛 */}
          <SentimentPieChart
            title="전체 감정 분포"
            counts={totalSentiment}
            height={260}
            donut
            legend
          />

          {/* 오른쪽: 카테고리별 막대 (제목 포함) */}
          <CategorySentimentBar
            title="카테고리별 감정 분포"
            categorySentiment={categorySentiment}
            height={260}
          />

          {/* 하단: 텍스트 요약(2열 전체 폭) */}
          <div className="lg:col-span-2">
            <p className="text-gray-800 text-s leading-relaxed whitespace-pre-line">
              {overallSummary}
            </p>
          </div>
        </div>
      </div>
    )}



      {/* 비교 섹션 */}
      {compareNote && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 mt-8">
          <h3 className="text-xl font-bold mb-4">
            <span className="text-blue-500 font-black mr-2">🔀</span>비교
          </h3>
          <p className="text-gray-700 text-s leading-relaxed whitespace-pre-line">
            {compareNote}
          </p>
        </div>
      )}
    </div>
  );
}
export default AnalyzeResultContent;
