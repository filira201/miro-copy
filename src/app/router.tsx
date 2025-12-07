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
          <>
            <AppHeader />
            <ProtectedRoute />
          </>
        ),
        children: [
          {
            path: ROUTES.BOARDS,
            lazy: () => import("@/features/boards-list/boards-list.page"),
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
