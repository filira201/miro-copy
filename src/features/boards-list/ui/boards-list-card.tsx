import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { Link, href } from "react-router";

interface BoardsListCardProps {
  board: {
    id: string;
    name: string;
    createdAt: string;
    lastOpenedAt: string;
  };
  rightTopActions?: React.ReactNode;
  bottomActions?: React.ReactNode;
}

export function BoardsListCard({ board, bottomActions, rightTopActions }: BoardsListCardProps) {
  return (
    <Card className="relative overflow-hidden h-full flex flex-col">
      {rightTopActions && <div className="absolute top-2 right-2 z-10 shrink-0">{rightTopActions}</div>}
      <CardHeader className="flex-1 min-w-0">
        <div className="flex flex-col gap-2 min-w-0 pr-8">
          <Button asChild variant="link" className="text-left justify-start h-auto p-0 min-w-0">
            <Link to={href(ROUTES.BOARD, { boardId: board.id })} className="min-w-0">
              <span className="text-xl font-medium truncate block" title={board.name}>
                {board.name}
              </span>
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground truncate">
            Создано: {new Date(board.createdAt).toLocaleDateString()}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            Открыто: {new Date(board.lastOpenedAt).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      {bottomActions && <CardFooter className="shrink-0 mt-auto">{bottomActions}</CardFooter>}
    </Card>
  );
}
