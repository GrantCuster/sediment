export function processLayer(
  sourceCanvas: HTMLCanvasElement,
  destinationCanvas: HTMLCanvasElement,
  cellSize: number,
  _xOffset: number | null,
  _yOffset: number | null,
  rgbThreshold: number,
) {
  const stx = sourceCanvas.getContext("2d")!;
  const dtx = destinationCanvas.getContext("2d")!;
  const imageWidth = sourceCanvas.width;
  const imageHeight = sourceCanvas.height;
  destinationCanvas.width = imageWidth;
  destinationCanvas.height = imageHeight;
  let rows = Math.ceil(sourceCanvas.height / cellSize);
  let cols = Math.ceil(sourceCanvas.width / cellSize);

  const xOffset =
    _xOffset !== null
      ? _xOffset
      : Math.floor((cols * cellSize - imageWidth) / 2);
  const yOffset =
    _yOffset !== null
      ? _yOffset
      : Math.floor((rows * cellSize - imageHeight) / 2);

  rows = Math.ceil((sourceCanvas.height + yOffset) / cellSize);
  cols = Math.ceil((sourceCanvas.width + xOffset) / cellSize);

  const imageDataContainer = stx.getImageData(0, 0, imageWidth, imageHeight);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let count = 0;
      for (let r = 0; r < cellSize; r++) {
        const actualY = row * cellSize + r - yOffset;
        const rowCheck = actualY >= 0 && actualY < imageHeight;
        for (let c = 0; c < cellSize; c++) {
          const actualX = col * cellSize + c - xOffset;
          const colCheck = actualX >= 0 && actualX < imageWidth;
          if (rowCheck && colCheck) {
            const idx = (actualY * imageWidth + actualX) * 4;
            totalR += imageDataContainer.data[idx];
            totalG += imageDataContainer.data[idx + 1];
            totalB += imageDataContainer.data[idx + 2];
            count++;
          }
        }
      }
      const avgR = totalR / count;
      const avgG = totalG / count;
      const avgB = totalB / count;
      let drawIt = true;
      if (rgbThreshold > 0) {
        let lossR = 0;
        let lossG = 0;
        let lossB = 0;
        let count = 0;
        for (let r = 0; r < cellSize; r++) {
          const actualY = row * cellSize + r - yOffset;
          const rowCheck = actualY >= 0 && actualY < imageHeight;
          for (let c = 0; c < cellSize; c++) {
            const actualX = col * cellSize + c - xOffset;
            const colCheck = actualX >= 0 && actualX < imageWidth;
            if (rowCheck && colCheck) {
              const idx = (actualY * imageWidth + actualX) * 4;
              lossR += Math.abs(imageDataContainer.data[idx] - avgR);
              lossG += Math.abs(imageDataContainer.data[idx + 1] - avgG);
              lossB += Math.abs(imageDataContainer.data[idx + 2] - avgB);
              count++;
            }
          }
        }
        const avgLossR = lossR / count;
        const avgLossG = lossG / count;
        const avgLossB = lossB / count;
        if ((avgLossR + avgLossG + avgLossB) / 3 < rgbThreshold) {
          drawIt = false;
        }
      }
      if (drawIt) {
        dtx.fillStyle = `rgb(${avgR}, ${avgG}, ${avgB})`;
        dtx.fillRect(
          col * cellSize - xOffset,
          row * cellSize - yOffset,
          cellSize,
          cellSize,
        );
      }
    }
  }

  // const bufferCanvas = document.createElement("canvas");
  // bufferCanvas.width = 16;
  // bufferCanvas.height = 16;
  // const btx = bufferCanvas.getContext("2d")!;
  // btx.drawImage(
  //   sourceCanvas,
  //   0,
  //   0,
  //   sourceCanvas.width,
  //   sourceCanvas.height,
  //   0,
  //   0,
  //   bufferCanvas.width,
  //   bufferCanvas.height,
  // );
  // destinationCanvas.width = sourceCanvas.width;
  // destinationCanvas.height = sourceCanvas.height;
  // const dtx = destinationCanvas.getContext("2d")!;
  // dtx.imageSmoothingEnabled = false;
  // dtx.drawImage(
  //   bufferCanvas,
  //   0,
  //   0,
  //   bufferCanvas.width,
  //   bufferCanvas.height,
  //   0,
  //   0,
  //   destinationCanvas.width,
  //   destinationCanvas.height,
  // );
  function processpixel() {
    // side: number,
    // ctx: canvasrenderingcontext2d,
    // image: htmlimageelement,
    const ctx = sourceCanvas.getContext("2d")!;
    const imageDataContainer = ctx.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
    );
    // const destinationdata = destinationimagedata.data;
    // const box = side * side;
    // for (let row = 0; row < image.height; row += side) {
    //   for (let col = 0; col < image.width; col += side) {
    //     let avgchannelr = 0;
    //     let avgchannelg = 0;
    //     let avgchannelb = 0;
    //     let avgchnanell = 0;
    //     let avgchnanelc = 0;
    //     let avgchnanelh = 0;
    //     for (let r = 0; r < side; r++) {
    //       for (let c = 0; c < side; c++) {
    //         const idx = ((row + r) * image.width + (col + c)) * 4;
    //         const red = sourcedata[idx];
    //         const green = sourcedata[idx + 1];
    //         const blue = sourcedata[idx + 2];
    //         const [lightness, chroma, hue] = colors.convert(
    //           [red / 255, green / 255, blue / 255],
    //           colors.srgb,
    //           colors.oklch,
    //         );
    //         avgchannelr += red;
    //         avgchannelg += green;
    //         avgchannelb += blue;
    //         avgchnanell += lightness;
    //         avgchnanelc += chroma;
    //         avgchnanelh += hue;
    //       }
    //     }
    //     avgchannelr /= box;
    //     avgchannelg /= box;
    //     avgchannelb /= box;
    //     avgchnanell /= box;
    //     avgchnanelc /= box;
    //     avgchnanelh /= box;
    //
    //     let difffromavgr = 0;
    //     let difffromavgg = 0;
    //     let difffromavgb = 0;
    //     let difffromavgl = 0;
    //     let difffromavgc = 0;
    //     let difffromavgh = 0;
    //     for (let r = 0; r < side; r++) {
    //       for (let c = 0; c < side; c++) {
    //         const idx = ((row + r) * image.width + (col + c)) * 4;
    //         const red = sourcedata[idx];
    //         const green = sourcedata[idx + 1];
    //         const blue = sourcedata[idx + 2];
    //         difffromavgr += math.abs(avgchannelr - red);
    //         difffromavgg += math.abs(avgchannelg - green);
    //         difffromavgb += math.abs(avgchannelb - blue);
    //         const [lightness, chroma, hue] = colors.convert(
    //           [red / 255, green / 255, blue / 255],
    //           colors.srgb,
    //           colors.oklch,
    //         );
    //         difffromavgl += math.abs(avgchnanell - lightness);
    //         difffromavgc += math.abs(avgchnanelc - chroma);
    //         difffromavgh += math.abs(avgchnanelh - hue);
    //       }
    //     }
    //     difffromavgr /= box;
    //     difffromavgg /= box;
    //     difffromavgb /= box;
    //     difffromavgl /= box;
    //     difffromavgc /= box;
    //     difffromavgh /= box;
    //
    //     const difffromavg = (difffromavgr + difffromavgg + difffromavgb) / 3;
    //
    //     if (row === 0) {
    //       console.log(difffromavgl);
    //     }
    //     if (difffromavgh > 80 || difffromavgl > 0.1 || difffromavgc > 0.01) {
    //       if (side > 1) {
    //         const stride = side / 2;
    //         for (let r = 0; r < side; r += stride) {
    //           for (let c = 0; c < side; c += stride) {
    //             let avgchannelr = 0;
    //             let avgchannelg = 0;
    //             let avgchannelb = 0;
    //             for (let rr = 0; rr < stride; rr++) {
    //               for (let cc = 0; cc < stride; cc++) {
    //                 const idx =
    //                   ((row + r + rr) * image.width + (col + c + cc)) * 4;
    //                 const red = sourcedata[idx];
    //                 const green = sourcedata[idx + 1];
    //                 const blue = sourcedata[idx + 2];
    //                 avgchannelr += red;
    //                 avgchannelg += green;
    //                 avgchannelb += blue;
    //               }
    //             }
    //             avgchannelr /= stride * stride;
    //             avgchannelg /= stride * stride;
    //             avgchannelb /= stride * stride;
    //             for (let rr = 0; rr < stride; rr++) {
    //               for (let cc = 0; cc < stride; cc++) {
    //                 const shift = 5;
    //                 const idx =
    //                   ((row + r + rr) * image.width + (col + c + cc)) * 4;
    //
    //                 destinationdata[idx] = (avgchannelr >> shift) << shift;
    //                 destinationdata[idx + 1] = (avgchannelg >> shift) << shift;
    //                 destinationdata[idx + 2] = (avgchannelb >> shift) << shift;
    //                 destinationdata[idx + 3] = sourcedata[idx + 3];
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // ctx.putimagedata(destinationimagedata, 0, 0);
  }
}
