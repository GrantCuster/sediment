import { useAtom } from "jotai";
import { useRef, useState, useEffect } from "react";
import { ImageAtom } from "./atoms";
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

  useEffect(() => {
    async function main() {
      //   const canvas = canvasRef.current;
      //   if (!canvas) return;
      //   const ctx = canvas.getContext("2d");
      //   if (!ctx) return;
      //   if (!image) return;
      //   if (!bufferCanvasRef.current)
      //     bufferCanvasRef.current = document.createElement("canvas");
      //   const bufferCanvas = bufferCanvasRef.current;
      //   const bufferCtx = bufferCanvas.getContext("2d")!;
      //   if (!thresholdCanvasRef.current)
      //     thresholdCanvasRef.current = document.createElement("canvas");
      //   const thresholdCanvas = thresholdCanvasRef.current;
      //   const thresholdCtx = thresholdCanvas.getContext("2d")!;
      //   bufferCanvas.width = image.width;
      //   bufferCanvas.height = image.height;
      //   thresholdCanvas.width = image.width;
      //   thresholdCanvas.height = image.height;
      //   canvas.width = image.width;
      //   canvas.height = image.height;
      //
      //   bufferCtx.drawImage(image, 0, 0, image.width, image.height);
      //   thresholdCtx.drawImage(image, 0, 0, image.width, image.height);
      //
      //   const thresholdData = thresholdCtx.getImageData(
      //     0,
      //     0,
      //     image.width,
      //     image.height,
      //   );
      //   const threshold = 160;
      //   const thresholdDataArray = thresholdData.data;
      //   for (let i = 0; i < thresholdDataArray.length; i += 4) {
      //     const red = thresholdDataArray[i];
      //     const green = thresholdDataArray[i + 1];
      //     const blue = thresholdDataArray[i + 2];
      //     const avg = (red + green + blue) / 3;
      //     if (avg < threshold) {
      //       thresholdDataArray[i] = 0;
      //       thresholdDataArray[i + 1] = 0;
      //       thresholdDataArray[i + 2] = 0;
      //     } else {
      //       thresholdDataArray[i] = 255;
      //       thresholdDataArray[i + 1] = 255;
      //       thresholdDataArray[i + 2] = 255;
      //     }
      //   }
      //   thresholdCtx.putImageData(thresholdData, 0, 0);
      //
      //   const sourceImageData = bufferCtx.getImageData(
      //     0,
      //     0,
      //     image.width,
      //     image.height,
      //   );
      //   const sourceData = sourceImageData.data;
      //   const shift = 5;
      //   // for (let i = 0; i < sourceData.length; i += 4) {
      //   //   const red = sourceData[i];
      //   //   const green = sourceData[i + 1];
      //   //   const blue = sourceData[i + 2];
      //   //   sourceData[i] = (red >> shift) << shift;
      //   //   sourceData[i + 1] = (green >> shift) << shift;
      //   //   sourceData[i + 2] = (blue >> shift) << shift;
      //   // }
      //
      //   function processPixel(
      //     side: number,
      //     ctx: CanvasRenderingContext2D,
      //     image: HTMLImageElement,
      //   ) {
      //     const destinationImageData = ctx.getImageData(
      //       0,
      //       0,
      //       image.width,
      //       image.height,
      //     );
      //     const destinationData = destinationImageData.data;
      //     const box = side * side;
      //     for (let row = 0; row < image.height; row += side) {
      //       for (let col = 0; col < image.width; col += side) {
      //         let avgChannelR = 0;
      //         let avgChannelG = 0;
      //         let avgChannelB = 0;
      //         let avgChnanelL = 0;
      //         let avgChnanelC = 0;
      //         let avgChnanelH = 0;
      //         for (let r = 0; r < side; r++) {
      //           for (let c = 0; c < side; c++) {
      //             const idx = ((row + r) * image.width + (col + c)) * 4;
      //             const red = sourceData[idx];
      //             const green = sourceData[idx + 1];
      //             const blue = sourceData[idx + 2];
      //             const [lightness, chroma, hue] = colors.convert(
      //               [red / 255, green / 255, blue / 255],
      //               colors.sRGB,
      //               colors.OKLCH,
      //             );
      //             avgChannelR += red;
      //             avgChannelG += green;
      //             avgChannelB += blue;
      //             avgChnanelL += lightness;
      //             avgChnanelC += chroma;
      //             avgChnanelH += hue;
      //           }
      //         }
      //         avgChannelR /= box;
      //         avgChannelG /= box;
      //         avgChannelB /= box;
      //         avgChnanelL /= box;
      //         avgChnanelC /= box;
      //         avgChnanelH /= box;
      //
      //         let diffFromAvgR = 0;
      //         let diffFromAvgG = 0;
      //         let diffFromAvgB = 0;
      //         let diffFromAvgL = 0;
      //         let diffFromAvgC = 0;
      //         let diffFromAvgH = 0;
      //         for (let r = 0; r < side; r++) {
      //           for (let c = 0; c < side; c++) {
      //             const idx = ((row + r) * image.width + (col + c)) * 4;
      //             const red = sourceData[idx];
      //             const green = sourceData[idx + 1];
      //             const blue = sourceData[idx + 2];
      //             diffFromAvgR += Math.abs(avgChannelR - red);
      //             diffFromAvgG += Math.abs(avgChannelG - green);
      //             diffFromAvgB += Math.abs(avgChannelB - blue);
      //             const [lightness, chroma, hue] = colors.convert(
      //               [red / 255, green / 255, blue / 255],
      //               colors.sRGB,
      //               colors.OKLCH,
      //             );
      //             diffFromAvgL += Math.abs(avgChnanelL - lightness);
      //             diffFromAvgC += Math.abs(avgChnanelC - chroma);
      //             diffFromAvgH += Math.abs(avgChnanelH - hue);
      //           }
      //         }
      //         diffFromAvgR /= box;
      //         diffFromAvgG /= box;
      //         diffFromAvgB /= box;
      //         diffFromAvgL /= box;
      //         diffFromAvgC /= box;
      //         diffFromAvgH /= box;
      //
      //         const diffFromAvg =
      //           (diffFromAvgR + diffFromAvgG + diffFromAvgB) / 3;
      //
      //         if (row === 0) {
      //           // console.log(diffFromAvgL);
      //         }
      //         if (
      //           diffFromAvgH > 80 ||
      //           diffFromAvgL > 0.1 ||
      //           diffFromAvgC > 0.01
      //         ) {
      //          if (side > 1) {
      //             const stride = side / 2;
      //             for (let r = 0; r < side; r += stride) {
      //               for (let c = 0; c < side; c += stride) {
      //                 let avgChannelR = 0;
      //                 let avgChannelG = 0;
      //                 let avgChannelB = 0;
      //                 for (let rr = 0; rr < stride; rr++) {
      //                   for (let cc = 0; cc < stride; cc++) {
      //                     const idx =
      //                       ((row + r + rr) * image.width + (col + c + cc)) * 4;
      //                     const red = sourceData[idx];
      //                     const green = sourceData[idx + 1];
      //                     const blue = sourceData[idx + 2];
      //                     avgChannelR += red;
      //                     avgChannelG += green;
      //                     avgChannelB += blue;
      //                   }
      //                 }
      //                 avgChannelR /= stride * stride;
      //                 avgChannelG /= stride * stride;
      //                 avgChannelB /= stride * stride;
      //                 for (let rr = 0; rr < stride; rr++) {
      //                   for (let cc = 0; cc < stride; cc++) {
      //                     const shift = 5;
      //                     const idx =
      //                       ((row + r + rr) * image.width + (col + c + cc)) * 4;
      //
      //                     destinationData[idx] = (avgChannelR >> shift) << shift;
      //                     destinationData[idx + 1] =
      //                       (avgChannelG >> shift) << shift;
      //                     destinationData[idx + 2] =
      //                       (avgChannelB >> shift) << shift;
      //                     destinationData[idx + 3] = sourceData[idx + 3];
      //                   }
      //                 }
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //     ctx.putImageData(destinationImageData, 0, 0);
      //   }
      //
      //   const layers = [512, 256, 128, 64, 32, 16, 8];
      //   let level = 0;
      //   function processLayer() {
      //     const layer = layers[level];
      //     processPixel(layer, ctx, image);
      //     level++;
      //     if (level < layers.length) {
      //       setTimeout(processLayer, 800);
      //     }
      //   }
      //   processLayer();
      //
      //   setWidth(image.width);
      //   setHeight(image.height);
      //   const dataUrl = canvas.toDataURL("image/png");
      //   const blob = await fetch(dataUrl).then((res) => res.blob());
      //   setFileSize(blob.size);
    }
    main();
  }, [image]);

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
