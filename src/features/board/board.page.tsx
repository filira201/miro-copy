import { Button } from "@/shared/ui/kit/button";
import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useNodes } from "./nodes";
import { useBoardViewState } from "./view-state";
import { useEffect, useRef, type Ref } from "react";
import { useCanvasRef } from "./use-canvas-rect";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/kit/tooltip";
import { Kbd } from "@/shared/ui/kit/kbd";

const useLayoutFocus = () => {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layoutRef.current) {
      layoutRef.current.focus();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        layoutRef.current?.focus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return layoutRef;
};

function BoardPage() {
  const { nodes, addSticker } = useNodes();
  const { viewState, goToIdle, goToAddSticker } = useBoardViewState();
  const { canvasRef, canvasRect } = useCanvasRef();
  const layoutRef = useLayoutFocus();

  console.log(canvasRect);

  return (
    <Layout
      ref={layoutRef}
      onKeyDown={(e) => {
        if (viewState.type === "add-sticker") {
          if (e.code === "KeyS") {
            goToIdle();
          }
        } else if (viewState.type === "idle") {
          if (e.code === "KeyS") {
            goToAddSticker();
          }
        }
      }}
    >
      <Dots />
      <Canvas
        ref={canvasRef}
        onClick={(event) => {
          if (viewState.type === "add-sticker" && canvasRect) {
            addSticker({ text: "Default", x: event.clientX - canvasRect.x, y: event.clientY - canvasRect.y });
            goToIdle();
          }
        }}
      >
        {nodes.map((node) => (
          <Sticker key={node.id} text={node.text} x={node.x} y={node.y} />
        ))}
      </Canvas>
      <Actions>
        <ActionButton
          isActive={viewState.type === "add-sticker"}
          onClick={() => {
            if (viewState.type === "add-sticker") {
              goToIdle();
            } else {
              goToAddSticker();
            }
          }}
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

function Layout({
  children,
  ref,
  ...props
}: { children: React.ReactNode; ref: Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} ref={ref} className="grow relative" tabIndex={0}>
      {children}
    </div>
  );
}

function Dots() {
  return <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"></div>;
}

function Canvas({
  children,
  ref,
  ...props
}: { children: React.ReactNode; ref: Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} ref={ref} className="absolute inset-0">
      {children}
    </div>
  );
}

function Sticker({ text, x, y }: { text: string; x: number; y: number }) {
  return (
    <div
      className="absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {text}
    </div>
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
  isActive: boolean;
  tooltipContent?: React.ReactNode;
  onClick: () => void;
}) {
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={isActive ? "bg-blue-500/30 hover:bg-blue-600/30 text-blue-500 hover:text-blue-600" : ""}
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
