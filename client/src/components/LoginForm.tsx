import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Although password is not used in backend, keep for UI completeness
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      setError(null);
      navigate("/home");
      window.location.reload(); // Reload to update auth state
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          autoComplete="email"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block mb-1 font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          autoComplete="current-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.status === "loading"}
      >
        {loginMutation.status === "loading" ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
