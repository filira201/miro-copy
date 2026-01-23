import { useCallback, useState, type RefCallback } from "react";

type CanvasRef = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const useCanvasRef = () => {
  const [canvasRect, setCanvasRect] = useState<CanvasRef>();

  const canvasRef: RefCallback<HTMLDivElement> = useCallback((el) => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const { x, y } = entry.target.getBoundingClientRect();

        setCanvasRect({ x, y, width, height });
      }
    });

    if (el) {
      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return { canvasRef, canvasRect };
};
