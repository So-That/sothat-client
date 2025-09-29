import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import mockVideos from "../mock/videos.json";

function AnalyzeKeywordResult() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedSort, setSelectedSort] = useState("like");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("query") || "";

  // useEffect(() => {
  //   if (!keyword) return;
  //   const fetchVideos = async () => {
  //     try {
  //       setVideos(mockVideos); // ✅ mock data
  //     } catch (err) {
  //       console.error(err);
  //       setVideos([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchVideos();
  // }, [keyword]);

  useEffect(() => {
  if (!keyword) return;

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/youtube/search?query=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) throw new Error("서버 응답 실패");

      const data = await response.json();
      setVideos(data); // ✅ 실제 API 결과로 대체
    } catch (err) {
      console.error("영상 로딩 실패:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  fetchVideos();
}, [keyword]);


  const toggleVideoSelection = (video) => {
    setSelectedVideos((prev) => {
      const exists = prev.find((v) => v.videoId === video.videoId);
      if (exists) {
        return prev.filter((v) => v.videoId !== video.videoId);
      } else if (prev.length < 50) {
        return [...prev, video];
      } else {
        alert("최대 50개까지 선택할 수 있습니다.");
        return prev;
      }
    });
  };

  const handleAnalyzeClick = () => {
    const urls = selectedVideos.map((v) => v.videoId);
    navigate("/analyze", { state: { urls, keyword } });
  };

  const getSortedVideos = () => {
    const sorted = [...videos];
    switch (selectedSort) {
      case "like":
        return sorted.sort((a, b) => b.likeCount - a.likeCount);
      case "latest":
        return sorted.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      case "comment":
        return sorted.sort((a, b) => b.commentCount - a.commentCount);
      case "view":
        return sorted.sort((a, b) => b.viewCount - a.viewCount);
      case "subscriber":
        return sorted.sort((a, b) => b.subscriberCount - a.subscriberCount);
      default:
        return sorted;
    }
  };

  return (
    <div>
      <Navbar />

      {/* 상단 헤더 */}
      <div className="bg-[#F44F49] text-white py-8 px-6 shadow-md rounded-b-3xl">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🧾</span>
          <h2 className="text-xl font-bold">분석 영상 선택하기</h2>
          <p className="ml-4 text-sm text-white/90">
            분석하고 싶은 영상을 선택해주세요!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 mb-20 flex gap-6">
        {/* 🔽 좌측 정렬 버튼 리스트 */}
        <div className="flex flex-col gap-2">
          {[
            { key: "like", label: "좋아요순" },
            { key: "latest", label: "최신순" },
            { key: "comment", label: "댓글순" },
            { key: "view", label: "조회수순" },
            { key: "subscriber", label: "구독자순" },
          ].map((sort) => (
            <button
              key={sort.key}
              onClick={() => setSelectedSort(sort.key)}
              className={`w-[120px] h-[36px] rounded-full font-semibold text-sm transition
                ${
                  selectedSort === sort.key
                    ? "bg-[#4B4B4B] text-white"
                    : "bg-[#EBEBEB] text-black"
                }`}
            >
              {sort.label}
            </button>
          ))}
        </div>

        {/* 🔽 영상 카드 리스트 */}
        <div className="flex-1 flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-gray-500">로딩 중...</p>
          ) : getSortedVideos().length === 0 ? (
            <p className="text-center text-gray-500">표시할 영상이 없습니다.</p>
          ) : (
            getSortedVideos().map((video, index) => {
              const isSelected = selectedVideos.some((v) => v.videoId === video.videoId);
              return (
                <div
                  key={index}
                  className={`flex border rounded-xl p-4 items-center shadow-sm transition cursor-pointer ${
                    isSelected ? "border-red-500 bg-red-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleVideoSelection(video)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt="thumb"
                    className="w-48 h-28 rounded-xl object-cover mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-bold mb-2 line-clamp-2">{video.title}</p>
                    <div className="flex items-center mb-2">
                      <img
                        src={video.profileImageUrl}
                        alt="profile"
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <span className="font-semibold mr-2">{video.channelTitle}</span>
                      <span className="text-sm text-gray-500">
                        구독자 {Math.round(video.subscriberCount / 1000) / 10}만명
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                      <span>📺 {Number(video.viewCount).toLocaleString()}회</span>
                      <span>
                        🗓 {new Date(video.publishedAt).toLocaleDateString("ko-KR").slice(2)}
                      </span>
                      <span>👍 {Number(video.likeCount).toLocaleString()}개</span>
                      <span>💬 {Number(video.commentCount).toLocaleString()}개</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ✅ 선택된 경우 하단 고정 분석 버튼 */}
      {selectedVideos.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleAnalyzeClick}
            className="bg-red-500 text-white px-10 py-3 rounded-full shadow-md hover:bg-red-600 transition text-lg"
          >
            분석하기 →
          </button>
        </div>
      )}
    </div>
  );
}

export default AnalyzeKeywordResult;
