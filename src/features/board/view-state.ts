import { useState } from "react";

type AddStickerState = {
  type: "add-sticker";
};

type IdleViewState = {
  type: "idle";
};

type ViewState = AddStickerState | IdleViewState;

export function useBoardViewState() {
  const [viewState, setViewState] = useState<ViewState>({ type: "idle" });

  const goToIdle = () => {
    setViewState({ type: "idle" });
  };

  const goToAddSticker = () => {
    setViewState({ type: "add-sticker" });
  };

  return { viewState, goToIdle, goToAddSticker };
}
