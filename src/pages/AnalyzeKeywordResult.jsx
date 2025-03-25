// AnalyzeKeywordResult.jsx
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import mockVideos from "../mock/videos.json"; // 더미 영상 데이터

function AnalyzeKeywordResult() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const scrollTimeout = useRef(null);

  // 첫 로딩 시 초기 데이터 세팅
  useEffect(() => {
    fetchMoreVideos();
  }, []);

  // scroll 감지 (멈췄을 때만 fetch)
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 100;
        if (isBottom && !isFetching) {
          fetchMoreVideos();
        }
      }, 200); // 유저가 멈춘 후 0.2초 내 행동 없을 때
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  const fetchMoreVideos = () => {
    setIsFetching(true);

    // 6개씩 불러오기
    const start = page * 6;
    const next = mockVideos.slice(start, start + 6);

    setVideos((prev) => [...prev, ...next]);
    setPage((prev) => prev + 1);
    setIsFetching(false);
  };

  return (
    <div>
      <Navbar />

      <div className="bg-red-500 text-white py-6 px-4 text-center">
        <h2 className="text-xl font-bold">🔍 분석 영상 선택하기</h2>
        <p className="text-sm">분석하고 싶은 영상을 선택해주세요!</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="w-full border-2 border-red-400 rounded-full px-6 py-3 pr-12 mb-6"
        />

        <div className="grid gap-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="flex border rounded-xl p-4 items-center shadow-sm"
            >
              <img
                src={video.thumbnailUrl}
                alt="thumb"
                className="w-40 h-24 rounded object-cover mr-4"
              />
              <div className="flex-1">
                <p className="font-semibold text-base mb-1 line-clamp-2">
                  {video.title}
                </p>
                <p className="text-sm text-gray-500">
                  {video.channelTitle} ・ {video.viewCount} 조회수
                </p>
              </div>
              <button className="text-2xl text-gray-500">✔️</button>
            </div>
          ))}

          {isFetching && <p className="text-center text-gray-400">불러오는 중...</p>}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeKeywordResult;
