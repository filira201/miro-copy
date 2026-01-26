import type { IdleViewState } from "../../model/view-state";
import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";

export function useIdleViewModel({ viewStateModel, nodesModel }: ViewModelParams) {
  return (idleViewState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: idleViewState.selectedIds.has(node.id),
      onClick: (e) => {
        if (e.ctrlKey || e.shiftKey || e.metaKey) {
          viewStateModel.selection([node.id], "toggle");
        } else {
          viewStateModel.selection([node.id], "replace");
        }
      },
    })),
    layout: {
      onKeyDown: (e) => {
        if (e.code === "KeyS") {
          viewStateModel.goToAddSticker();
        }
      },
    },
    overlay: {
      onClick: () => {
        viewStateModel.selection([], "replace");
      },
    },
    actions: {
      addSticker: {
        isActive: false,
        onClick: () => {
          viewStateModel.goToAddSticker();
        },
      },
    },
  });
}
