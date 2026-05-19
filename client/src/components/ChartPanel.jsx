import { Chart } from "chart.js/auto";
import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const ChartPanel = ({ config, title, subtitle }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, config);

    return () => chartRef.current?.destroy();
  }, [config, theme]);

  return (
    <div className="surface rounded-lg p-5">
      <div className="mb-4">
        <h3 className="font-black text-ink dark:text-white">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <div className="h-72">
        <canvas ref={canvasRef} aria-label={title} />
      </div>
    </div>
  );
};

export default ChartPanel;
