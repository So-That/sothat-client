// src/pages/AnalyzeURL.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";
import Navbar from "../components/Navbar";

// ✅ 유튜브 videoId 추출기 (watch/shorts/embed/live/youtu.be, www/m 도메인 모두 지원)
const extractYouTubeId = (raw) => {
  if (!raw) return null;
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    // 호스트 정규화
    const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
    const path = url.pathname.replace(/\/+$/, ""); // 끝 슬래시 제거
    const segs = path.split("/").filter(Boolean);  // ["shorts", "VIDEOID"]

    // 1) youtu.be/<id>
    if (host === "youtu.be" && segs.length >= 1) {
      const id = segs[0];
      return id.length === 11 ? id : null;
    }

    // 2) youtube.com/watch?v=<id>
    if (host.endsWith("youtube.com") && url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && id.length === 11 ? id : null;
    }

    // 3) youtube.com/shorts/<id>
    if (host.endsWith("youtube.com") && segs[0] === "shorts" && segs[1]) {
      return segs[1].length === 11 ? segs[1] : null;
    }

    // 4) youtube.com/embed/<id>
    if (host.endsWith("youtube.com") && segs[0] === "embed" && segs[1]) {
      return segs[1].length === 11 ? segs[1] : null;
    }

    // 5) youtube.com/live/<id>  (라이브 VOD 링크)
    if (host.endsWith("youtube.com") && segs[0] === "live" && segs[1]) {
      return segs[1].length === 11 ? segs[1] : null;
    }

    return null;
  } catch {
    return null;
  }
};

// ✅ 유효성: videoId가 뽑히면 OK
const isValidYoutubeUrl = (url) => !!extractYouTubeId(url);

function AnalyzeURL() {
  const { input } = useSearch();
  const navigate = useNavigate();

  const [urls, setUrls] = useState([{ value: "", error: false, duplicate: false }]);

  // 중복 체크: "문자열"이 아니라 "videoId" 기준으로!
  const checkDuplicatesById = (arr) => {
    const ids = arr.map((u) => extractYouTubeId(u.value.trim()) || "");
    return arr.map((u, i) => {
      const id = ids[i];
      return id && ids.indexOf(id) !== i; // 같은 id가 앞에 이미 있으면 중복
    });
  };

  const handleChange = (index, value) => {
    const updated = [...urls];
    updated[index].value = value;

    const trimmed = value.trim();
    updated[index].error = trimmed !== "" && !isValidYoutubeUrl(trimmed);

    // videoId 기준 중복 체크
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
  const filled = urls.filter((u) => u.value.trim() !== "");
  const hasInvalid = filled.some(
    (u) => u.error || u.duplicate || !isValidYoutubeUrl(u.value)
  );

  if (hasInvalid) {
    alert("유효하지 않거나 중복된 URL이 있습니다.");
    return;
  }

  // videoId만 추출
  const videoIds = filled.map((u) => extractYouTubeId(u.value.trim()));

  navigate("/analyze", {
    state: {
      urls: videoIds, // 백엔드 요구사항: urls 필드에 id 배열
      keyword: input || "",
    },
  });
}; 


  return (
    <div className="relative min-h-screen pb-28">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-30 px-4">
        <h2 className="text-2xl font-bold mb-1">
          🔗 {input?.trim().length > 0 ? `"${input}" 키워드로 분석하기` : "키워드로 분석하기"}
        </h2>
        <p className="text-gray-600 mb-4">선택한 키워드와 관련된 영상 URL을 입력해 분석해보세요!</p>
        <div className="border-b-2 border-red-500 w-full mb-6"></div>

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
                    const ok = isValidYoutubeUrl(url.value);
                    const id = extractYouTubeId(url.value);
                    const ids = urls.map((u) => extractYouTubeId(u.value)).filter(Boolean);
                    const dup = id && ids.includes(id) && ids.indexOf(id) !== ids.lastIndexOf(id);
                    if (ok && !dup) addUrl();
                  }
                }}
                placeholder="https://youtu.be/... 또는 https://youtube.com/shorts/..."
                className={`flex-1 border px-4 py-2 rounded ${
                  url.error || url.duplicate ? "border-red-500" : ""
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
            {url.duplicate && <p className="text-sm text-red-500 ml-2">중복된 영상(URL)입니다.</p>}
          </div>
        ))}

        <div className="mb-16">
          <button
            onClick={addUrl}
            className="text-sm px-3 py-1 border border-gray-300 rounded bg-gray-100 hover:bg-white"
          >
            URL 추가
          </button>
          <p className="text-xs text-gray-400 mt-1">※ 여러 영상을 분석하고 싶다면 URL을 추가하세요.</p>
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={handleAnalyze}
          className="bg-red-500 text-white px-10 py-3 rounded-full shadow-md hover:bg-red-600 transition text-lg"
        >
          분석하기 →
        </button>
      </div>
    </div>
  );
}

export default AnalyzeURL;
