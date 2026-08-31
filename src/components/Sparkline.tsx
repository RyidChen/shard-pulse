import type { MetricSnapshot } from "../types/server";

interface SparklineProps {
  history: MetricSnapshot[];
  serverName: string;
  height?: number;
}

export function Sparkline({
  history,
  serverName,
  height = 36,
}: SparklineProps) {
  const values = history.map((snapshot) => snapshot.ping);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const denominator = Math.max(values.length - 1, 1);
  // 將任意數量與範圍的 Ping 正規化到固定的 100 × 34 SVG 座標。
  const points = values
    .map((value, index) => {
      const x = (index / denominator) * 100;
      const y = 29 - ((value - min) / range) * 24;
      return `${x},${y}`;
    })
    .join(" ");
  const latest = values.at(-1) ?? 0;

  return (
    <svg
      role="img"
      aria-label={`${serverName} Ping 趨勢，最新數值 ${latest} 毫秒`}
      viewBox="0 0 100 34"
      preserveAspectRatio="none"
      className="w-full overflow-visible"
      style={{ height }}
    >
      <path d="M0 29 H100" stroke="currentColor" opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
