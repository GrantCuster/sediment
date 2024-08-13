import { useAtom } from "jotai";
import { useRef, useState, useEffect } from "react";
import { CanvasBumpAtom, ImageAtom, LayerIdsAtom, LayerMapAtom } from "./atoms";
import { bytesToHumanReadable } from "./utils";
import * as colors from "@texel/color";

export function DestinationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const thresholdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [image] = useAtom(ImageAtom);
  const [layerMap] = useAtom(LayerMapAtom);
  const [layerIds] = useAtom(LayerIdsAtom);
  const [canvasBump] = useAtom(CanvasBumpAtom);
  const [renderBump] = useAtom(CanvasBumpAtom);

  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = image.width;
    canvas.height = image.height;

    for (const id of layerIds) {
      const layer = layerMap[id];
      ctx.drawImage(layer.canvas, 0, 0);
    }
  }, [renderBump, image, layerMap, layerIds]);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="hidden">
        <div>
          {width}x{height}, {bytesToHumanReadable(fileSize ?? 0)}
        </div>
      </div>
    </div>
  );
}
