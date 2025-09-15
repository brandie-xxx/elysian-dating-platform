import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // For UI completeness
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }
      return response.json();
    },
    onSuccess: async () => {
      setError(null);
      try {
        await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      } catch (e) {
        // ignore
      }
      try {
        const target = sessionStorage.getItem("postAuthRedirect");
        if (target) {
          sessionStorage.removeItem("postAuthRedirect");
          navigate(target);
        } else {
          navigate("/home");
        }
      } catch (e) {
        navigate("/home");
      }
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 rounded shadow glass-subtle"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
        Sign Up
      </h2>
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-1 font-semibold text-foreground"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border rounded px-3 py-2 bg-card text-card-foreground placeholder:text-muted-foreground"
          autoComplete="email"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block mb-1 font-semibold text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border rounded px-3 py-2 bg-card text-card-foreground placeholder:text-muted-foreground"
          autoComplete="new-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground"
        disabled={signupMutation.status === "pending"}
      >
        {signupMutation.status === "pending" ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>
  );
}
