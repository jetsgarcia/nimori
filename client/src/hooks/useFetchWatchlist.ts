import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function useFetchWatchlist() {
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [watchingList, setWatchingList] = useState<number[]>([]);
  const [watchedList, setWatchedList] = useState<number[]>([]);
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
        setWatchlist(data.watchlist);
        setWatchingList(data.watchinglist);
        setWatchedList(data.watched);
      } catch (error) {
        console.error((error as Error).message);
        toast.error("Failed to fetch watchlist");
      }
    };

    fetchWatchlist();
  }, [user, getToken]);

  return [watchlist, watchingList, watchedList];
}
