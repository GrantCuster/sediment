import { useAtom } from "jotai";
import {
  CanvasBumpAtom,
  LayerIdsAtom,
  LayerMapAtom,
  SourceCanvasAtom,
} from "./atoms";
import { useEffect, useRef } from "react";
import { processLayer } from "./Processing";

export function Layers() {
  const [layerIds] = useAtom(LayerIdsAtom);

  return (
    <div>
      {layerIds.map((id) => (
        <Layer key={id} id={id} />
      ))}
    </div>
  );
}

export function Layer({ id }: { id: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [layerMap] = useAtom(LayerMapAtom);
  const [sourceCanvas] = useAtom(SourceCanvasAtom);
  const [canvasBump] = useAtom(CanvasBumpAtom);

  const layer = layerMap[id];

  console.log(layerMap);
  console.log(layer);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (canvas) {
      processLayer(sourceCanvas, layer.canvas, layer.cellSize);

      const ctx = canvas.getContext("2d")!;
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(layer.canvas, 0, 0);
    }
  }, [layer, sourceCanvas, canvasBump]);

  return layer ? (
    <div>
      <canvas className="max-w-full" ref={canvasRef} />
      <div>{id}</div>
      <div>{layer.cellSize}</div>
    </div>
  ) : null;
}
