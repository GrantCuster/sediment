import { useEffect, useRef, useState } from "react";
import { SlothImage } from "./data";
import { bytesToHumanReadable, loadImage } from "./utils";
import { useAtom } from "jotai";
import {
  CanvasBumpAtom,
  ImageAtom,
  ImageSourceAtom,
  SourceCanvasAtom,
} from "./atoms";
import { DestinationCanvas } from "./DestinationCanvas";
import { useHandleDragAndDrop } from "./useHandleDragAndDrop";
import { Layers } from "./Layers";

function App() {
  useHandleDragAndDrop();

  return (
    <div className="w-full relative h-[100dvh] overflow-hidden flex">
      <div className="hidden w-full h-1/2 lg:w-1/2 md:h-full relative">
        <SourceCanvas />
      </div>
      <div className="w-full h-full relative">
        <DestinationCanvas />
      </div>
      <div className="w-[320px]">
        <Layers />
      </div>
    </div>
  );
}

function SourceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileSize ] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [imageSource] = useAtom(ImageSourceAtom);
  const [, setImage] = useAtom(ImageAtom);
  const [, setSourceCanvas] = useAtom(SourceCanvasAtom);
  const [, setCanvasBump] = useAtom(CanvasBumpAtom);

  useEffect(() => {
    async function main() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (!imageSource) return;
      const slothImage = await loadImage(imageSource);
      setImage(slothImage);
      setWidth(slothImage.width);
      setHeight(slothImage.height);
      canvas.width = slothImage.width;
      canvas.height = slothImage.height;
      ctx.drawImage(slothImage, 0, 0, slothImage.width, slothImage.height);
      setSourceCanvas(canvas);
      setCanvasBump((prev) => prev + 1);

      // const dataUrl = canvas.toDataURL("image/png");
      // const blob = await fetch(dataUrl).then((res) => res.blob());
      // setFileSize(blob.size);
    }
    main();
  }, [imageSource]);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
      <div>
        <div>
          {width}x{height}, {bytesToHumanReadable(fileSize ?? 0)}
        </div>
      </div>
    </div>
  );
}

export default App;
