import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";
import Navbar from "../components/Navbar";

// 유튜브 URL 유효성 검사
const isValidYoutubeUrl = (url) => {
  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})(\S*)?$/
  return regex.test(url.trim());
};

function AnalyzeURL() {
  const { input } = useSearch();
  const navigate = useNavigate();

  const [urls, setUrls] = useState([
    { value: "", error: false, duplicate: false },
  ]);

  const checkDuplicates = (arr) => {
    const values = arr.map((u) => u.value.trim());
    return values.map((v, i) => values.indexOf(v) !== i && v !== "");
  };

  const handleChange = (index, value) => {
    const updated = [...urls];
    updated[index].value = value;

    const trimmed = value.trim();
    updated[index].error = trimmed !== "" && !isValidYoutubeUrl(trimmed);

    const nonEmpty = updated.filter((u) => u.value.trim() !== "").map((u) => u.value.trim());
    const duplicates = nonEmpty.map((v, i, arr) => arr.indexOf(v) !== i && v !== "");

    updated.forEach((u, i) => {
      u.duplicate =
        u.value.trim() !== "" &&
        duplicates[nonEmpty.indexOf(u.value.trim())];
    });

    setUrls(updated);
  };

  const addUrl = () => {
    setUrls([...urls, { value: "", error: false, duplicate: false }]);
  };

  const removeUrl = (index) => {
    const updated = urls.filter((_, i) => i !== index);
    const duplicates = checkDuplicates(updated);
    updated.forEach((u, i) => {
      u.duplicate = duplicates[i];
    });
    setUrls(updated);
  };

  const handleAnalyze = () => {
    const filledUrls = urls.filter((url) => url.value.trim() !== "");
    const hasInvalid = filledUrls.some((url) => url.error || url.duplicate);

    if (hasInvalid) {
      alert("유효하지 않거나 중복된 URL이 있습니다.");
      return;
    }

    const validUrls = filledUrls.map((url) => url.value.trim());
    console.log("분석할 URL들:", validUrls);

    navigate("/analyze", {
      state: {
        urls: validUrls,
        keyword: input || "", // 키워드도 함께 넘김
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
        <p className="text-gray-600 mb-4">
          선택한 키워드와 관련된 영상 URL을 입력해 분석해보세요!
        </p>
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
                    if (
                      isValidYoutubeUrl(url.value) &&
                      !urls.some((u, i) => u.value === url.value && i !== index)
                    ) {
                      addUrl();
                    }
                  }
                }}
                placeholder="https://youtu.be/..."
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
            {url.duplicate && (
              <p className="text-sm text-red-500 ml-2">중복된 URL입니다.</p>
            )}
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
