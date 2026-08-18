import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { client } from "#/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "../styles.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={client}>
      <header>
        <nav>
          <ul className="flex flex-row gap-3">
            <li>
              <Link to="/">home</Link>
            </li>
            <li>
              <Link to="/browser">browser</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-8">
        <Outlet />
      </main>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </QueryClientProvider>
  );
}
