import type { ViewModel, ViewModelParams } from "../use-view-model";

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
