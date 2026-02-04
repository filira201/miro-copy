import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type AddStickerState = {
  type: "add-sticker";
};

export function useAddStickerViewModel({ setViewState, nodesModel, canvasRect }: ViewModelParams) {
  return (): ViewModel => ({
    nodes: nodesModel.nodes,
    layout: {
      onKeyDown: (e) => {
        if (e.code === "KeyS") {
          setViewState(goToIdle());
        }
      },
    },
    canvas: {
      onClick: (e) => {
        if (!canvasRect) return;
        nodesModel.addSticker({ text: "Default", x: e.clientX - canvasRect.x, y: e.clientY - canvasRect.y });
        setViewState(goToIdle());
      },
    },
    actions: {
      addSticker: {
        isActive: true,
        onClick: () => {
          setViewState(goToIdle());
        },
      },
    },
  });
}

export function goToAddSticker(): AddStickerState {
  return {
    type: "add-sticker",
  };
}
