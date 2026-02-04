import {
  selectItems,
  type Selection,
  type SelectionModifier,
} from "../../domain/selection";
import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToAddSticker } from "./add-sticker";
import { distanceFromPoint } from "../../domain/point";
import { goToSelectionWindow } from "./selection-window";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
  mouseDown?: {
    x: number;
    y: number;
  };
};

export function useIdleViewModel({
  setViewState,
  nodesModel,
  canvasRect,
}: ViewModelParams) {
  const select = (
    lastState: IdleViewState,
    ids: string[],
    modif: SelectionModifier
  ) => {
    setViewState({
      ...lastState,
      selectedIds: selectItems(lastState.selectedIds, ids, modif),
    });
  };

  return (idleViewState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: idleViewState.selectedIds.has(node.id),
      onClick: (e) => {
        if (e.ctrlKey || e.shiftKey || e.metaKey) {
          select(idleViewState, [node.id], "toggle");
        } else {
          select(idleViewState, [node.id], "replace");
        }
      },
    })),
    layout: {
      onKeyDown: (e) => {
        if (e.code === "KeyS") {
          setViewState(goToAddSticker());
        }
      },
    },
    overlay: {
      onMouseDown: (e) => {
        setViewState({
          ...idleViewState,
          mouseDown: pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            canvasRect
          ),
        });
      },
      onMouseUp: () => {
        if (idleViewState.mouseDown) {
          select(idleViewState, [], "replace");
        }
      },
    },
    window: {
      onMouseMove: (e) => {
        if (idleViewState.mouseDown) {
          const currentPoint = pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            canvasRect
          );

          if (distanceFromPoint(idleViewState.mouseDown, currentPoint) > 5) {
            setViewState(
              goToSelectionWindow({
                startPoint: idleViewState.mouseDown,
                endPoint: currentPoint,
                initialSelectedIds: e.shiftKey
                  ? idleViewState.selectedIds
                  : undefined,
              })
            );
          }
        }
      },
      onMouseUp: () => {
        setViewState({ ...idleViewState, mouseDown: undefined });
      },
    },
    actions: {
      addSticker: {
        isActive: false,
        onClick: () => {
          setViewState(goToAddSticker());
        },
      },
    },
  });
}

export function goToIdle({
  selectedIds,
}: { selectedIds?: Selection } = {}): IdleViewState {
  return {
    type: "idle",
    selectedIds: selectedIds ?? new Set(),
  };
}
