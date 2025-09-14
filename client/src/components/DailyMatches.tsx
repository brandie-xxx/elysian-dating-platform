import React, { useState } from "react";
import useDailyMatches from "../hooks/useDailyMatches";

export default function DailyMatches() {
  const { data, isLoading, error, refetch } = useDailyMatches();
  const [pendingLikes, setPendingLikes] = useState<Record<string, boolean>>({});

  async function like(matchId: string) {
    if (pendingLikes[matchId]) return;
    setPendingLikes((s) => ({ ...s, [matchId]: true }));

    try {
      // optimistic: disable button and show pending
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likedUserId: matchId }),
      });
      // refetch list after success
      refetch();
    } catch (e) {
      console.error("like failed", e);
      // optionally show toast in the future
    } finally {
      setPendingLikes((s) => ({ ...s, [matchId]: false }));
    }
  }

  if (isLoading) {
    // simple skeleton grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 bg-white rounded shadow animate-pulse">
            <div className="w-full h-40 bg-gray-200 rounded" />
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
            <div className="mt-1 h-3 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="text-red-600">
        Error loading matches: {String(error.message)}
      </div>
    );

  const matches = data?.matches || [];
  const matchesShown = data?.matchesShown || 0;
  const maxMatches = data?.maxMatches || 5;
  const message = data?.message;

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Daily Matches: {matchesShown} / {maxMatches}
        {message && <span className="ml-2 text-orange-600">{message}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.length > 0 ? (
          matches.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-40 bg-gray-100 rounded overflow-hidden">
                <img
                  src={m.avatarUrl || "/placeholder.png"}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2">
                <div className="font-semibold">
                  {m.name}
                  {m.age ? `, ${m.age}` : ""}
                </div>
                <div className="text-sm text-gray-600">{m.bio}</div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <button
                  onClick={() => like(m.id)}
                  disabled={!!pendingLikes[m.id]}
                  aria-label={`like-${m.id}`}
                  className={`px-3 py-1 rounded ${
                    pendingLikes[m.id]
                      ? "bg-gray-300 text-gray-600"
                      : "bg-pink-500 text-white"
                  }`}
                >
                  {pendingLikes[m.id] ? "Liking..." : "Like"}
                </button>
                <button className="text-sm text-muted-foreground">View</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground col-span-full">
            No matches for today. Check back later.
          </div>
        )}
      </div>
    </div>
  );
}
