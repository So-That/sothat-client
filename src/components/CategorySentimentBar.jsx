// src/components/CategorySentimentBar.jsx
import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const ORDER = ["POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"];
const LABEL = { POSITIVE: "긍정", NEGATIVE: "부정", NEUTRAL: "중립", MIXED: "혼합" };
const COLORS = { POSITIVE: "#22c55e", NEGATIVE: "#ef4444", NEUTRAL: "#facc15", MIXED: "#3b82f6" };

// ✅ "A/B" → "A" 로 잘라주는 헬퍼 (전각 슬래시도 대응)
const shortCategory = (v) => String(v ?? "").split(/[\/／]/)[0].trim();

// ✅ X축 라벨 커스텀: 짧게 보여주고, hover 시 전체 제목 툴팁
function ShortTick({ x, y, payload }) {
  const full = payload?.value ?? "";
  const short = shortCategory(full);
  return (
    <text
      x={x}
      y={y + 16}                 // 축선 아래로 살짝 내림
      textAnchor="middle"
      fontSize={12}
      fill="#667085"
      title={full}               // 마우스 올리면 전체 텍스트 표시
    >
      {short}
    </text>
  );
}

export default function CategorySentimentBar({
  categorySentiment = {},
  height = 300,
  title,
  legendChips = true,
  categoryName = "이 카테고리",
}) {
  // 단일/전체 모두 지원
  const isSingle = useMemo(() => {
    const ks = Object.keys(categorySentiment || {});
    return ks.includes("POSITIVE") || ks.includes("NEGATIVE")
        || ks.includes("NEUTRAL")  || ks.includes("MIXED");
  }, [categorySentiment]);

  const data = useMemo(() => {
    if (isSingle) {
      const c = categorySentiment || {};
      return [{
        category: categoryName,
        POSITIVE: Number(c.POSITIVE || 0),
        NEGATIVE: Number(c.NEGATIVE || 0),
        NEUTRAL:  Number(c.NEUTRAL  || 0),
        MIXED:    Number(c.MIXED    || 0),
      }];
    }
    return Object.entries(categorySentiment).map(([category, c]) => ({
      category,
      POSITIVE: Number(c?.POSITIVE || 0),
      NEGATIVE: Number(c?.NEGATIVE || 0),
      NEUTRAL:  Number(c?.NEUTRAL  || 0),
      MIXED:    Number(c?.MIXED    || 0),
    }));
  }, [categorySentiment, categoryName, isSingle]);

  return (
    <div className="w-full">
      {title && <div className="text-sm font-semibold mb-2">{title}</div>}

      <div className="relative bg-white border border-gray-200 rounded-xl p-3" tabIndex={-1}>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer tabIndex={-1}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 28 }} // ✅ 라벨 공간 살짝 더
            >
              <CartesianGrid stroke="#eee" vertical={false} />
              {/* ✅ X축 라벨을 커스텀 컴포넌트로 교체 */}
              <XAxis dataKey="category" tick={<ShortTick />} interval={0} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              {ORDER.map((k) => (
                <Bar key={k} dataKey={k} name={LABEL[k]} fill={COLORS[k]} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 하단 칩 범례 (원하면 끌 수 있음) */}
      {legendChips && (
        <ul className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs">
          {ORDER.map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded" style={{ background: COLORS[k] }} />
              <span className="text-gray-800">{LABEL[k]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
