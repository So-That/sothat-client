import React from "react";

const sectionData = {
  "가격/구성": "아이폰 15는 높은 가격대에도 불구하고 128GB의 기본 저장 용량과 OS 업데이트 장점으로 장기적인 가치가 있다고 평가받고 있습니다. 그러나 구성품이 충전 케이블만 포함되어 있어 아쉬움이 남고, 구형 모델과의 변화가 적다는 지적도 있습니다.",
  "디자인/외형": "아이폰 15는 파스텔 톤 색상과 부드러운 테두리 질감으로 세련된 인상을 주며, 매트한 후면 유리는 지문이 덜 묻어 실사용자에게 만족감을 줍니다. 그러나 카메라 범프가 여전히 튀어나와 불균형한 느낌을 줄 수 있습니다.",
  "성능/기능": "A16 바이오닉 칩셋 덕분에 앱 실행 속도와 멀티태스킹 성능이 뛰어나며, 발열 관리가 개선되어 장시간 사용에도 쾌적합니다. USB-C 포트 도입으로 호환성이 높아졌으나, 일반 모델의 USB 2.0 속도는 아쉬운 점으로 지적됩니다.",
  "편의성/사용감": "iOS 17의 다양한 기능들이 사용 편의성을 높여주며, 페이스 ID 인식 속도와 정확성이 뛰어나 스트레스 없는 사용이 가능합니다. 무게 밸런스와 조작감 또한 우수하여 장시간 사용 시 손목 부담이 적습니다.",
  "품질/내구성": "세라믹 실드 유리와 항공우주 등급 알루미늄 프레임 덕분에 내구성이 뛰어나고, IP68 방수 방진 등급으로 생활 방수 걱정이 없습니다. 그러나 기스나 스크래치에 취약하다는 의견이 존재합니다."
};

const overallSummary =
  "아이폰 15는 높은 가격에도 불구하고 128GB 기본 저장 용량과 장기적인 OS 지원으로 가치를 인정받고 있습니다. 그러나 구성품이 충전 케이블만 포함되어 있어 아쉬움이 있으며, 구형 모델과의 변화가 적다는 점이 지적됩니다. 디자인 면에서는 파스텔 톤 색상과 매트한 후면 유리가 만족감을 주지만, 카메라 범프의 불균형이 단점으로 언급되고 있습니다. 성능 측면에서는 A16 바이오닉 칩셋 덕분에 뛰어난 멀티태스킹과 발열 관리가 돋보이며, USB-C 포트 도입으로 호환성은 증가했으나 속도 제한이 아쉽습니다. 편의성은 iOS 17의 기능 덕에 향상되었으며, 페이스 ID 인식의 속도와 정확성이 사용자에게 긍정적인 경험을 제공합니다. 마지막으로, 세라믹 실드와 알루미늄 프레임으로 내구성이 뛰어나지만 기스와 스크래치에 취약한 점은 다소 우려되는 요소입니다.";

function AnalyzeResultContent() {
  const keys = Object.keys(sectionData);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      {keys.map((title, index) => (
        <div
          key={title}
          className="bg-white rounded-2xl shadow-md p-6 mb-10 border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-4">
            <span className="text-red-500 font-black mr-2">{index + 1}</span>
            {title}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {sectionData[title]}
          </p>
        </div>
      ))}

      {/* 종합 요약 */}
      <div
        id="summary-section"
        className="bg-white rounded-2xl shadow-md p-6 border border-gray-300"
      >
        <h3 className="text-xl font-bold mb-4">
          <span className="text-red-500 font-black mr-2">🧾</span>전체 요약
        </h3>
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
          {overallSummary}
        </p>
      </div>
    </div>
  );
}

export default AnalyzeResultContent;
