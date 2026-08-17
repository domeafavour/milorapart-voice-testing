import { QueryClient } from "@tanstack/react-query";

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      // 1h
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    },
  },
});
