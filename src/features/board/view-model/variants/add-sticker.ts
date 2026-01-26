import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";

export function useAddStickerViewModel({ viewStateModel, nodesModel, canvasRect }: ViewModelParams) {
  return (): ViewModel => ({
    nodes: nodesModel.nodes,
    layout: {
      onKeyDown: (e) => {
        if (e.code === "KeyS") {
          viewStateModel.goToIdle();
        }
      },
    },
    canvas: {
      onClick: (e) => {
        if (!canvasRect) return;
        nodesModel.addSticker({ text: "Default", x: e.clientX - canvasRect.x, y: e.clientY - canvasRect.y });
        viewStateModel.goToIdle();
      },
    },
    actions: {
      addSticker: {
        isActive: true,
        onClick: () => {
          viewStateModel.goToIdle();
        },
      },
    },
  });
}
