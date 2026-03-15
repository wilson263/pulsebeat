import { useQueryClient } from "@tanstack/react-query";
import { useGetMe, useLogin, useSignup, useLogout } from "@workspace/api-client-react";

const TOKEN_KEY = "pulsebeat_token";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetMe({
    query: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    }
  });

  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useLogin({
    mutation: {
      onSuccess: (data) => {
        if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      }
    }
  });

  const { mutateAsync: signupMutation, isPending: isSigningUp } = useSignup({
    mutation: {
      onSuccess: (data) => {
        if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      }
    }
  });

  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useLogout({
    mutation: {
      onSuccess: () => {
        localStorage.removeItem(TOKEN_KEY);
        queryClient.clear();
        window.location.href = "/login";
      }
    }
  });

  return {
    user: userError ? null : user,
    isLoading: isLoadingUser,
    isAuthenticated: !!user && !userError,
    login: loginMutation,
    signup: signupMutation,
    logout: logoutMutation,
    isLoggingIn,
    isSigningUp,
    isLoggingOut
  };
}
