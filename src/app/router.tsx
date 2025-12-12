import { createBrowserRouter, redirect } from "react-router";
import { ROUTES } from "@/shared/model/routes";
import { App } from "./app";
import { Providers } from "./providers";
import { ProtectedRoute } from "./protected-route";
import { AppHeader } from "@/features/header";
import { protectedLoader } from "./protected-loader";

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <App />
      </Providers>
    ),
    // Убираю предупреждение No `HydrateFallback` element provided to
    // render during initial hydration, т.к. нету SSR

    HydrateFallback: () => null,
    children: [
      {
        loader: protectedLoader,
        element: (
          <div className="h-screen flex flex-col overflow-hidden">
            <AppHeader />
            <div className="flex-1 overflow-hidden">
              <ProtectedRoute />
            </div>
          </div>
        ),
        children: [
          {
            path: ROUTES.BOARDS,
            lazy: () => import("@/features/boards-list/boards-list.page"),
          },
          {
            path: ROUTES.FAVORITE_BOARDS,
            lazy: () => import("@/features/boards-list/boards-list-favorite.page"),
          },
          {
            path: ROUTES.RECENT_BOARDS,
            lazy: () => import("@/features/boards-list/boards-list-recent.page"),
          },
          {
            path: ROUTES.BOARD,
            lazy: () => import("@/features/board/board.page"),
          },
        ],
      },

      {
        path: ROUTES.LOGIN,
        lazy: () => import("@/features/auth/login.page"),
      },
      {
        path: ROUTES.REGISTER,
        lazy: () => import("@/features/auth/register.page"),
      },
      {
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.BOARDS),
      },
    ],
  },
]);
