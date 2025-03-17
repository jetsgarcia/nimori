import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function useFetchWatchlist() {
  const [fetchFromDBLoading, setFetchFromDBLoading] = useState(true);
  const [watchlistFromDB, setWatchlistFromDB] = useState<number[]>([]);
  const [watchingListFromDB, setWatchingListFromDB] = useState<number[]>([]);
  const [watchedListFromDB, setWatchedListFromDB] = useState<number[]>([]);
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return toast.error("User not found. Please sign in.");

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/users/${user.id}/watchlist`,
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch watchlist");

        const data = await response.json();
        setWatchlistFromDB(data.watchlist);
        setWatchingListFromDB(data.watching);
        setWatchedListFromDB(data.watched);
        setFetchFromDBLoading(false);
      } catch (error) {
        console.error((error as Error).message);
        toast.error("Failed to fetch watchlist");
      }
    };

    fetchWatchlist();
  }, [user, getToken]);

  return {
    watchlistFromDB,
    watchingListFromDB,
    watchedListFromDB,
    fetchFromDBLoading,
  };
}
