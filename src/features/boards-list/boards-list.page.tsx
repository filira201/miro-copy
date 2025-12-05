import { rqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { useQueryClient } from "@tanstack/react-query";
import { href, Link } from "react-router";

function BoardsListPage() {
  const queryClient = useQueryClient();
  const boards = rqClient.useQuery("get", "/boards");
  const createBoard = rqClient.useMutation("post", "/boards", {
    onSettled: async () => {
      await queryClient.invalidateQueries(rqClient.queryOptions("get", "/boards"));
    },
  });
  const deleteBoard = rqClient.useMutation("delete", "/boards/{boardId}", {
    onSettled: async () => {
      await queryClient.invalidateQueries(rqClient.queryOptions("get", "/boards"));
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1>Boards list</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          createBoard.mutate({
            body: {
              name: new FormData(e.target as HTMLFormElement).get("name") as string,
            },
          });
        }}
      >
        <input type="text" name="name" />
        <button disabled={createBoard.isPending} type="submit">
          Create
        </button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {boards.data?.map((board) => (
          <Card key={board.id}>
            <CardHeader>
              <Button asChild variant="link">
                <Link to={href(ROUTES.BOARD, { boardId: board.id })}>{board.name}</Link>
              </Button>
            </CardHeader>
            <CardFooter>
              <Button
                variant="destructive"
                disabled={deleteBoard.isPending}
                onClick={() => deleteBoard.mutate({ params: { path: { boardId: board.id } } })}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const Component = BoardsListPage;
