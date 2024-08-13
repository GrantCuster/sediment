import { atom } from "jotai";
import { SlothImage } from "./data";
import { v4 as uuid } from "uuid";

export const ImageSourceAtom = atom<string | null>(SlothImage);
export const ImageAtom = atom<HTMLImageElement | null>(null);
export const SourceCanvasAtom = atom<HTMLCanvasElement>(
  document.createElement("canvas"),
);
export const CanvasBumpAtom = atom(0);

export type LayerType = {
  id: string;
  cellSize: number;
  canvas: HTMLCanvasElement;
};
const firstId = uuid();
export const LayerMapAtom = atom<Record<string, LayerType>>({
  [firstId]: {
    id: firstId,
    cellSize: 64,
    canvas: document.createElement("canvas"),
  },
});
export const LayerIdsAtom = atom<string[]>([firstId]);
