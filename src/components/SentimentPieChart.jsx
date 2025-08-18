// src/components/SentimentPieChart.jsx
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// 고정 순서: 긍정 → 부정 → 중립 → 혼합
const ORDER = ["POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"];
const COLORS = {
  POSITIVE: "#22c55e", // green
  NEGATIVE: "#ef4444", // red
  NEUTRAL:  "#facc15", // yellow
  MIXED:    "#3b82f6", // blue
};
const RAD = Math.PI / 180;

const ko = (k) =>
  k === "POSITIVE" ? "긍정" :
  k === "NEGATIVE" ? "부정" :
  k === "NEUTRAL"  ? "중립" :
  k === "MIXED"    ? "혼합" : k;

function normalizeCounts(raw = {}) {
  return ORDER.map((k) => ({ name: k, value: Math.max(0, Number(raw?.[k] ?? 0)) }));
}

function labelPct({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) {
  if (!value || percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-[11px] fill-gray-800">
      {Math.round(percent * 100)}%
    </text>
  );
}

// ✅ 커스텀(한글) 범례: 차트 아래 렌더
function KoreanLegend() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-2 mt-2 text-sm">
      {ORDER.map((k) => (
        <li key={k} className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded" style={{ background: COLORS[k] }} />
          <span className="font-medium text-gray-800">{ko(k)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SentimentPieChart({
  title,
  counts,
  height = 220,
  donut = true,
  legend = true,       // true면 아래 커스텀 범례 노출
  showTooltip = false, // 툴팁 미사용
}) {
  const base  = useMemo(() => normalizeCounts(counts), [counts]);
  const total = useMemo(() => base.reduce((s, d) => s + d.value, 0), [base]);
  const data  = total === 0 ? ORDER.map((k) => ({ name: k, value: 1 })) : base;
  const noRealData = total === 0;

  return (
    <div className="w-full">
      {title && <div className="text-sm font-semibold mb-2">{title}</div>}

      <div className="relative bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-0" tabIndex={-1}>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer tabIndex={-1}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={donut ? "60%" : 0}
                outerRadius="90%"
                paddingAngle={1}
                stroke="#fff"
                strokeWidth={2}
                isAnimationActive={false}
                label={!noRealData ? labelPct : undefined}
                labelLine={false}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={COLORS[d.name] || "#999"} />
                ))}
              </Pie>

              {/* showTooltip 사용 시 여기서 Tooltip 컴포넌트 추가 가능 */}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {donut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 px-2 py-1 rounded-lg text-xs text-gray-600 shadow">
              총 {total}건
            </div>
          </div>
        )}
      </div>

      {/* ✅ 한글/순서 고정 범례(차트 하단) */}
      {legend && <KoreanLegend />}
    </div>
  );
}
