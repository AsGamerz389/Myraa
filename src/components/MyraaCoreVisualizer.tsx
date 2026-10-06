import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  active?: boolean;
  intensity?: number;
}

export const MyraaCoreVisualizer: React.FC<VisualizerProps> = ({ active = false, intensity = 0.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      phase += 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!active) return;

      const bars = 16;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const h = Math.abs(Math.sin(phase + i * 0.4)) * canvas.height * intensity;
        const x = i * barWidth;
        const y = (canvas.height - h) / 2;

        ctx.fillStyle = `rgba(99, 102, 241, ${0.4 + (h / canvas.height) * 0.6})`;
        ctx.fillRect(x + 1, y, barWidth - 2, h);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [active, intensity]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={24}
      className="rounded-full bg-slate-950/40 backdrop-blur-sm pointer-events-none"
    />
  );
};
