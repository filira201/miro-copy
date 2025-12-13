import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/kit/dialog";
import { Skeleton } from "@/shared/ui/kit/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Skeleton для модалки шаблонов
export function TemplatesModalSkeleton() {
  return (
    <Dialog open>
      <DialogContent className="max-w-3xl">
        <VisuallyHidden>
          <DialogTitle>Загрузка шаблонов</DialogTitle>
          <DialogDescription>Пожалуйста, подождите</DialogDescription>
        </VisuallyHidden>
        <DialogHeader aria-hidden>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-72 mt-2" />
        </DialogHeader>
        <div className="h-[60vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
