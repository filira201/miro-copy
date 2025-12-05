import { rqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
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
    <div>
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
      {boards.data?.map((board) => (
        <div key={board.id}>
          <Link to={href(ROUTES.BOARD, { boardId: board.id })}>{board.name}</Link>
          <button
            disabled={deleteBoard.isPending}
            onClick={() => deleteBoard.mutate({ params: { path: { boardId: board.id } } })}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export const Component = BoardsListPage;
