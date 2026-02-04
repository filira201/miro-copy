import {
  useAddStickerViewModel,
  type AddStickerState,
} from "./variants/add-sticker";
import { useIdleViewModel, type IdleViewState } from "./variants/idle";
import type { ViewModel } from "./view-model-type";
import type { ViewModelParams } from "./view-model-params";
import { useState } from "react";
import {
  useSelectionWindowViewModel,
  type SelectionWindowViewState,
} from "./variants/selection-window";

export type ViewState =
  | AddStickerState
  | IdleViewState
  | SelectionWindowViewState;

export function useViewModel(params: Omit<ViewModelParams, "setViewState">) {
  const [viewState, setViewState] = useState<ViewState>({
    type: "idle",
    selectedIds: new Set(),
  });

  let viewModel: ViewModel;

  const newParams = { ...params, setViewState };

  const addStickerViewModel = useAddStickerViewModel(newParams);
  const idleViewModel = useIdleViewModel(newParams);
  const selectionWindowViewModel = useSelectionWindowViewModel(newParams);

  switch (viewState.type) {
    case "add-sticker":
      viewModel = addStickerViewModel();
      break;
    case "idle": {
      viewModel = idleViewModel(viewState);
      break;
    }
    case "selection-window": {
      viewModel = selectionWindowViewModel(viewState);
      break;
    }
    default:
      throw new Error("Invalid view model state");
  }

  return viewModel;
}
