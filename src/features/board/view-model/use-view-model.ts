import { useAddStickerViewModel } from "./variants/add-sticker";
import { useIdleViewModel } from "./variants/idle";
import type { ViewModel } from "./view-model-type";
import type { ViewModelParams } from "./view-model-params";

export function useViewModel(params: ViewModelParams) {
  let viewModel: ViewModel;

  const addStickerViewModel = useAddStickerViewModel(params);
  const idleViewModel = useIdleViewModel(params);

  switch (params.viewStateModel.viewState.type) {
    case "add-sticker":
      viewModel = addStickerViewModel();
      break;
    case "idle": {
      viewModel = idleViewModel(params.viewStateModel.viewState);
      break;
    }
    default:
      throw new Error("Invalid view model state");
  }

  return viewModel;
}
