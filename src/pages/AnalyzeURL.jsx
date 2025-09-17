// src/pages/AnalyzeURL.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";
import Navbar from "../components/Navbar";

// ✅ YouTube videoId 추출기
const extractYouTubeId = (raw) => {
  if (!raw) return null;
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\.|^m\./, "");
    const path = url.pathname.replace(/\/+$/, "");
    const segs = path.split("/").filter(Boolean);

    if (host === "youtu.be" && segs[0]) return segs[0];
    if (host.endsWith("youtube.com") && url.pathname === "/watch")
      return url.searchParams.get("v");
    if (host.endsWith("youtube.com") && ["shorts", "embed", "live"].includes(segs[0]))
      return segs[1];

    return null;
  } catch {
    return null;
  }
};

const isValidYoutubeUrl = (url) => !!extractYouTubeId(url);

function AnalyzeURL() {
  const { input } = useSearch();
  const navigate = useNavigate();
  const [urls, setUrls] = useState([{ value: "", error: false, duplicate: false }]);

  // 중복 체크
  const checkDuplicatesById = (arr) => {
    const ids = arr.map((u) => extractYouTubeId(u.value.trim()) || "");
    return arr.map((_, i) => ids[i] && ids.indexOf(ids[i]) !== i);
  };

  const handleChange = (index, value) => {
    const updated = [...urls];
    updated[index].value = value.trim();
    updated[index].error = value && !isValidYoutubeUrl(value);

    const dupFlags = checkDuplicatesById(updated);
    updated.forEach((u, i) => (u.duplicate = dupFlags[i]));

    setUrls(updated);
  };

  const addUrl = () => {
    setUrls([...urls, { value: "", error: false, duplicate: false }]);
  };

  const removeUrl = (index) => {
    const updated = urls.filter((_, i) => i !== index);
    const dupFlags = checkDuplicatesById(updated);
    updated.forEach((u, i) => (u.duplicate = dupFlags[i]));
    setUrls(updated);
  };

  const handleAnalyze = () => {
    const filled = urls.filter((u) => u.value);
    const hasInvalid = filled.some((u) => u.error || u.duplicate);

    if (hasInvalid || filled.length === 0) {
      alert("유효하지 않거나 중복된 URL이 있습니다.");
      return;
    }

    const videoIds = filled.map((u) => extractYouTubeId(u.value));
    navigate("/analyze", {
      state: { urls: videoIds, keyword: input || "" },
    });
  };

  return (
    <div className="relative min-h-screen pb-28">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-20 px-4">
        {/* 헤더 */}
{/* 헤더 */}
<h2 className="text-2xl font-bold mb-1 text-black">
  🔗 {input?.trim()
    ? `"${input}" URL로 분석하기`
    : "URL로 분석하기"}
</h2>


        <p className="text-gray-600 mb-4">
          선택한 키워드와 관련된 영상 URL을 입력해 분석해보세요!
        </p>
        <div className="border-b-2 border-red-500 w-full mb-6"></div>

        {/* URL 입력 필드들 */}
        {urls.map((url, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <input
                type="text"
                value={url.value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isValidYoutubeUrl(url.value) && !url.duplicate) addUrl();
                  }
                }}
                placeholder="https://youtu.be/... 또는 https://youtube.com/shorts/..."
                className={`flex-1 border px-4 py-2 rounded transition ${
                  url.error || url.duplicate
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:border-[#F3284C]"
                }`}
              />
              {urls.length > 1 && (
                <button
                  onClick={() => removeUrl(index)}
                  className="text-red-500 font-bold text-xl"
                >
                  ✕
                </button>
              )}
            </div>

            {url.error && (
              <p className="text-sm text-red-500 ml-2">유효한 유튜브 링크를 입력해주세요.</p>
            )}
            {url.duplicate && (
              <p className="text-sm text-red-500 ml-2">중복된 영상(URL)입니다.</p>
            )}
          </div>
        ))}

        {/* URL 추가 버튼 */}
        <div className="mb-16">
          <button
            onClick={addUrl}
            className="text-sm px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 transition"
          >
            + URL 추가
          </button>
          <p className="text-xs text-gray-400 mt-1">
            ※ 여러 영상을 분석하고 싶다면 URL을 추가하세요.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleAnalyze}
            className="bg-[#F3284C] text-white px-10 py-3 rounded-full shadow-md hover:bg-red-600 transition text-lg"
          >
            분석하기 →
          </button>
        </div>

      </div>
    </div>
  );
}

export default AnalyzeURL;
