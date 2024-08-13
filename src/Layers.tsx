import { useAtom } from "jotai";
import {
  CanvasBumpAtom,
  LayerIdsAtom,
  LayerMapAtom,
  LayerType,
  RenderBumpAtom,
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
  const [layerMap, setLayerMap] = useAtom(LayerMapAtom);
  const [sourceCanvas] = useAtom(SourceCanvasAtom);
  const [canvasBump] = useAtom(CanvasBumpAtom);
  const [, setRenderBump] = useAtom(RenderBumpAtom);

  const layer = layerMap[id];

  function updateLayer(updates: Partial<LayerType>) {
    setLayerMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }));
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    console.log(canvasRef.current);
    console.log("eh");
    if (canvas) {
      console.log("what");
      processLayer(
        sourceCanvas,
        layer.canvas,
        layer.cellSize,
        layer.offsetX,
        layer.offsetY,
      );

      const ctx = canvas.getContext("2d")!;
      canvas.width = sourceCanvas.width;
      canvas.height = sourceCanvas.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(layer.canvas, 0, 0);
    }
    setRenderBump((prev) => prev + 1);
  }, [layer, sourceCanvas, canvasBump]);

  const activeOffsetX = layer.offsetX !== null;
  const activeOffsetY = layer.offsetY !== null;

  const rows = Math.ceil(sourceCanvas.height / layer.cellSize);
  const cols = Math.ceil(sourceCanvas.width / layer.cellSize);
  const autoOffsetX = Math.floor(
    (cols * layer.cellSize - sourceCanvas.width) / 2,
  );
  const autoOffsetY = Math.floor(
    (rows * layer.cellSize - sourceCanvas.height) / 2,
  );

  return layer ? (
    <div>
      <canvas className="max-w-full" ref={canvasRef} />
      <div>{layer.cellSize}</div>
      <div>
        <input
          type="range"
          min="1"
          max={canvasRef.current?.width}
          value={layer.cellSize}
          onChange={(e) => updateLayer({ cellSize: parseInt(e.target.value) })}
        />
      </div>
      <div className="flex items-center gap-1">
        <div>Offset x</div>
        <input
          type="checkbox"
          checked={activeOffsetX}
          onChange={(e) =>
            updateLayer({ offsetX: e.target.checked ? autoOffsetX : null })
          }
        />
        {activeOffsetX ? (
          <div className="flex gap-1">
            <input
              type="range"
              min="0"
              max={layer.cellSize}
              value={layer.offsetX as number}
              onChange={(e) =>
                updateLayer({ offsetX: parseInt(e.target.value) })
              }
            />
            <div>{layer.offsetX}</div>
          </div>
        ) : (
          <div>auto {autoOffsetX}</div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <div>Offset y</div>
        <input
          type="checkbox"
          checked={activeOffsetY}
          onChange={(e) =>
            updateLayer({ offsetY: e.target.checked ? autoOffsetY : null })
          }
        />
        {activeOffsetY ? (
          <div className="flex gap-1">
            <input
              type="range"
              min="0"
              max={layer.cellSize}
              value={layer.offsetY as number}
              onChange={(e) =>
                updateLayer({ offsetY: parseInt(e.target.value) })
              }
            />
            <div>{layer.offsetY}</div>
          </div>
        ) : (
          <div>auto {autoOffsetY}</div>
        )}
      </div>
    </div>
  ) : null;
}
