import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function AnalyzeKeywordResult() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("query") || "";

  useEffect(() => {
    if (!keyword) return;

    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/youtube/search?query=${encodeURIComponent(keyword)}`
        );

        if (!response.ok) throw new Error("서버 응답 실패");

        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("영상 가져오기 실패:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [keyword]);

  return (
    <div>
      <Navbar />
      <div className="bg-[#F44F49] text-white py-10 px-6 text-center">
        <h2 className="text-2xl font-bold mb-1">🧾 분석 영상 선택하기</h2>
        <p className="text-sm mb-6">"{keyword}" 검색 결과입니다</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10 mb-20">
        {loading ? (
          <p className="text-center text-gray-500">로딩 중...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-500">표시할 영상이 없습니다.</p>
        ) : (
          <div className="grid gap-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="flex border rounded-xl p-4 items-center shadow-sm"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyzeKeywordResult;
