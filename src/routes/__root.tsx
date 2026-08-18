import {
  Link,
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { client } from "#/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "../styles.css";

export const Route = createRootRoute({
  component: RootComponent,
});

const navLink =
  "rounded px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-steel transition-colors hover:text-fg";

function NavLink({
  to,
  exact,
  children,
}: {
  to: "/" | "/browser";
  exact?: boolean;
  children: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = exact ? pathname === to : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`${navLink} ${active ? "text-amber hover:text-amber" : ""}`}
    >
      {children}
    </Link>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="eq eq-sm" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="font-display text-lg font-semibold uppercase tracking-wide text-fg">
        Milo <span className="text-amber">Voice</span> Lab
      </span>
    </Link>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={client}>
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3.5 sm:px-6">
            <Brand />
            <nav aria-label="Main">
              <ul className="flex items-center gap-1">
                <li>
                  <NavLink to="/" exact>
                    Synth
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/browser">Browser</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
          <Outlet />
        </main>

        <footer className="border-t border-line">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-steel sm:px-6">
            <span>Milo Voice Lab</span>
            <span className="flex items-center gap-2">
              <span className="eq eq-xs" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </span>
              api · milorapart.top
            </span>
          </div>
        </footer>
      </div>
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