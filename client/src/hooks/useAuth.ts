import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(queryKey[0] as string);
        if (response.status === 401) {
          // 401 is expected when not authenticated - return null instead of throwing
          return null;
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      } catch (err) {
        // Handle network errors and other non-401 errors
        if (err instanceof Error && !isUnauthorizedError(err)) {
          throw err;
        }
        return null;
      }
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}