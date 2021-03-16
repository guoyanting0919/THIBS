export default function(str) {
  if (!str) {
    return "無資料";
  }
  const showLen = Math.round(str.length / 2); // 顯示幾個
  const markLen = str.length - showLen; // 要隱藏幾個
  const showStart = Math.round((str.length - showLen) / 2); // 從哪開始隱
  return str.replace(str.substr(showStart, markLen), "*".repeat(markLen));
}
