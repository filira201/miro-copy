import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router";

function BoardPage() {
  const { boardId } = useParams<PathParams[typeof ROUTES.BOARD]>();

  return <div>Board page {boardId}</div>;
}

export const Component = BoardPage;
