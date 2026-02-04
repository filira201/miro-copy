import { Button } from "@/shared/ui/kit/button";
import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useNodes } from "./model/nodes";
import { type Ref } from "react";
import { useCanvasRef } from "./hooks/use-canvas-rect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/kit/tooltip";
import { Kbd } from "@/shared/ui/kit/kbd";
import { useLayoutFocus } from "./hooks/use-layout-focus";
import { cn } from "@/shared/lib/css";
import { useViewModel } from "./view-model/use-view-model";
import type { Rect } from "./domain/rect";
import { useWindowEvents } from "./hooks/use-window-events";

function BoardPage() {
  const nodesModel = useNodes();
  const focusLayoutRef = useLayoutFocus();
  const { canvasRef, canvasRect } = useCanvasRef();

  const viewModel = useViewModel({ nodesModel, canvasRect });

  useWindowEvents(viewModel);

  return (
    <Layout ref={focusLayoutRef} onKeyDown={viewModel.layout?.onKeyDown}>
      <Dots />
      <Canvas ref={canvasRef} onClick={viewModel.canvas?.onClick}>
        <Overlay
          onClick={viewModel.overlay?.onClick}
          onMouseDown={viewModel.overlay?.onMouseDown}
          onMouseUp={viewModel.overlay?.onMouseUp}
        />
        {viewModel.nodes.map((node) => (
          <Sticker
            key={node.id}
            text={node.text}
            x={node.x}
            y={node.y}
            selected={node.isSelected}
            onClick={node.onClick}
          />
        ))}
      </Canvas>
      {viewModel.selectionWindow && (
        <SelectionWindow {...viewModel.selectionWindow} />
      )}
      <Actions>
        <ActionButton
          isActive={viewModel.actions?.addSticker?.isActive}
          onClick={viewModel.actions?.addSticker?.onClick}
          tooltipContent={
            <div className="flex items-center gap-2">
              Добавить стикер <Kbd>S</Kbd>
            </div>
          }
        >
          <StickerIcon />
        </ActionButton>
        <ActionButton isActive={false} onClick={() => {}}>
          <ArrowRightIcon />
        </ActionButton>
      </Actions>
    </Layout>
  );
}

export const Component = BoardPage;

export function SelectionWindow({ height, width, x, y }: Rect) {
  return (
    <div
      className="absolute inset-0 bg-blue-500/30 border-2 border-blue-500"
      style={{ width, height, transform: `translate(${x}px, ${y}px)` }}
    ></div>
  );
}

function Overlay({
  onClick,
  onMouseDown,
  onMouseUp,
}: {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className="absolute inset-0"
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    ></div>
  );
}

function Layout({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} ref={ref} className="grow relative" tabIndex={0}>
      {children}
    </div>
  );
}

function Dots() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"></div>
  );
}

function Canvas({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} ref={ref} className="absolute inset-0">
      {children}
    </div>
  );
}

function Sticker({
  text,
  x,
  y,
  onClick,
  selected,
}: {
  text: string;
  x: number;
  y: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md",
        selected && "outline-2 outline-blue-500"
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {text}
    </button>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1 rounded-md shadow">
      {children}
    </div>
  );
}

function ActionButton({
  children,
  isActive,
  tooltipContent,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  tooltipContent?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={
        isActive
          ? "bg-blue-500/30 hover:bg-blue-600/30 text-blue-500 hover:text-blue-600"
          : ""
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );

  if (!tooltipContent) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
