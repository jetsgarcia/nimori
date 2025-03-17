import { Anime } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import useFetchWatchlist from "@/hooks/useFetchWatchlist";
import DeleteConfirmationDialog from "./delete-confirmation-dialog";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface AnimeCardProps {
  anime: Anime;
  titleType: "english" | "romaji";
  cardType: "search" | "watchlist";
  setAnimeList?: React.Dispatch<React.SetStateAction<Anime[]>>;
}

export default function AnimeCard({
  anime,
  titleType,
  cardType,
  setAnimeList,
}: AnimeCardProps) {
  const [addedAnimeToWatchlist, setAddedAnimeToWatchlist] = useState<number>();
  const [removedAnimeToWatchlist, setRemovedAnimeToWatchlist] =
    useState<number>();
  const { watchlistFromDB, watchingListFromDB, watchedListFromDB } =
    useFetchWatchlist();
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationDialogVisible] =
    useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [watchStatus, setWatchStatus] = useState("toWatch");

  useEffect(() => {
    if (watchlistFromDB.includes(anime.id)) {
      setWatchStatus("toWatch");
    } else if (watchingListFromDB.includes(anime.id)) {
      setWatchStatus("watching");
    } else if (watchedListFromDB.includes(anime.id)) {
      setWatchStatus("watched");
    }
  }, [anime.id, watchlistFromDB, watchingListFromDB, watchedListFromDB]);

  // Create a separate function to handle status changes
  const handleWatchStatusChange = async (newStatus: string) => {
    if (!user) return toast.error("User not found. Please sign in.");
    const errorMessage = "Failed to update anime status.";

    try {
      // Only make API call if status actually changed
      if (newStatus === "toWatch") {
        await addAnimeToWatchlist();
      } else if (newStatus === "watching") {
        await addAnimeToWatchingList();
      } else if (newStatus === "watched") {
        await addAnimeToWatchedList();
      }

      // Update local state after successful API call
      setWatchStatus(newStatus);
    } catch {
      toast.error(errorMessage);
    }
  };

  async function addAnimeToWatchlist() {
    if (!user) return toast.error("User not found. Please sign in.");
    const errorMessage = "Failed to remove anime to watchlist.";
    const url = `${apiBaseUrl}/api/users/${user.id}/watchlist`;
    const token = await getToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ data: { animeId: anime.id } }),
    });
    if (!response.ok) return toast.error(errorMessage);
  }

  async function addAnimeToWatchingList() {
    if (!user) return toast.error("User not found. Please sign in.");
    const errorMessage = "Failed to remove anime to watchlist.";
    const url = `${apiBaseUrl}/api/users/${user.id}/watching`;
    const token = await getToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ data: { animeId: anime.id } }),
    });
    if (!response.ok) return toast.error(errorMessage);
  }

  async function addAnimeToWatchedList() {
    if (!user) return toast.error("User not found. Please sign in.");
    const errorMessage = "Failed to remove anime to watchlist.";
    const url = `${apiBaseUrl}/api/users/${user.id}/watched`;
    const token = await getToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ data: { animeId: anime.id } }),
    });
    if (!response.ok) return toast.error(errorMessage);
  }

  async function removeAnimeFromWatchlist() {
    if (!user) return toast.error("User not found. Please sign in.");
    const errorMessage = "Failed to remove anime to watchlist.";
    try {
      const url = `${apiBaseUrl}/api/users/${user.id}/watchlist`;
      const token = await getToken();

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ data: { animeId: anime.id } }),
      });
      if (!response.ok) return toast.error(errorMessage);
      setAddedAnimeToWatchlist(undefined);
      setRemovedAnimeToWatchlist(anime.id);
      if (setAnimeList) {
        setAnimeList((prev) => prev.filter((a) => a.id !== anime.id));
      }
    } catch {
      toast.error(errorMessage);
    }
  }

  async function handleWatchlist() {
    if (!user) return toast.error("User not found. Please sign in.");
    const token = await getToken();
    if (
      watchlistFromDB.includes(anime.id) ||
      addedAnimeToWatchlist === anime.id
    ) {
      setIsDeleteConfirmationDialogVisible(true);
    } else {
      // Adding anime to watchlist
      const url = `${apiBaseUrl}/api/users/${user.id}/watchlist`;
      const errorMessage = "Failed to add anime to watchlist.";

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            mode: "cors",
            credentials: "include",
          },
          body: JSON.stringify({ data: { animeId: anime.id } }),
        });
        if (!response.ok) return toast.error(errorMessage);
        setRemovedAnimeToWatchlist(undefined);
        setAddedAnimeToWatchlist(anime.id);
      } catch {
        toast.error(errorMessage);
      }
    }
  }

  return (
    <>
      <DeleteConfirmationDialog
        isDeleteConfirmationVisible={isDeleteConfirmationVisible}
        setIsDeleteConfirmationDialogVisible={
          setIsDeleteConfirmationDialogVisible
        }
        deleteAction={removeAnimeFromWatchlist}
      />
      <div className="hover:ring-primary-light dark:hover:ring-primary-dark flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:ring dark:bg-gray-900">
        <img
          src={anime.coverImage.extraLarge}
          alt={anime.title.romaji}
          height={385}
          className="h-[385px] w-full object-cover"
        />

        <div className="flex flex-grow flex-col justify-between p-4">
          <h2 className="mb-2 line-clamp-2 text-lg">
            {titleType === "english"
              ? anime.title.english || anime.title.romaji
              : anime.title.romaji}
          </h2>

          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {anime.format === "MOVIE"
                  ? "Movie"
                  : anime.episodes
                    ? `${anime.episodes} ${anime.episodes > 1 ? "Episodes" : "Episode"}`
                    : "Ep count unknown"}
              </span>
              <span>{anime.startDate?.year ?? "No date"}</span>
            </div>

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Status:{" "}
              {anime.status
                ? anime.status.charAt(0).toUpperCase() +
                  anime.status.slice(1).toLowerCase()
                : "No status"}
            </div>

            <div className="flex gap-1">
              {cardType === "watchlist" && (
                <Select
                  value={watchStatus}
                  onValueChange={handleWatchStatusChange}
                >
                  <SelectTrigger className="flex-grow cursor-pointer" size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toWatch">To watch</SelectItem>
                    <SelectItem value="watching">Watching</SelectItem>
                    <SelectItem value="watched">Watched</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button
                size="sm"
                className={cn(
                  "cursor-pointer",
                  cardType === "search" && "flex-grow",
                )}
                variant={cardType === "watchlist" ? "destructive" : "default"}
                onClick={handleWatchlist}
              >
                {(watchlistFromDB.includes(anime.id) ||
                  watchingListFromDB.includes(anime.id) ||
                  watchedListFromDB.includes(anime.id) ||
                  addedAnimeToWatchlist === anime.id) &&
                removedAnimeToWatchlist !== anime.id ? (
                  <>
                    {cardType === "watchlist" && <Trash />}
                    {cardType === "search" && (
                      <>
                        <Bookmark className="fill-bg-light dark:fill-bg-dark" />{" "}
                        <span>Remove from watchlist</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Bookmark /> <span>Add to watchlist</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
