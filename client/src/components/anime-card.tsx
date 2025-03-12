import { Anime } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useState } from "react";

interface AnimeCardProps {
  anime: Anime;
  titleType: "english" | "romaji";
  cardType: "add" | "remove";
  isFavorite: boolean;
}

export default function AnimeCard({
  anime,
  titleType,
  cardType,
  isFavorite,
}: AnimeCardProps) {
  const [addedAnimeToWatchlist, setAddedAnimeToWatchlist] = useState<number>();
  const { user } = useUser();

  async function handleWatchlist() {
    if (!user) return toast.error("User not found. Please sign in.");

    const url = `http://localhost:3000/users/${user.id}/watchlist`;
    const method = cardType === "add" ? "POST" : "DELETE";
    const errorMessage =
      cardType === "add"
        ? "Failed to add anime to watchlist."
        : "Failed to remove anime from watchlist.";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { animeId: anime.id } }),
      });

      if (!response.ok) return toast.error(errorMessage);

      setAddedAnimeToWatchlist(cardType === "add" ? anime.id : undefined);
    } catch {
      toast.error(errorMessage);
    }
  }

  return (
    <div className="hover:ring-primary-light dark:hover:ring-primary-dark flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:ring dark:bg-gray-900">
      <img
        src={anime.coverImage.extraLarge}
        alt={anime.title.romaji}
        height={385}
        className="h-[385px] w-full object-cover"
      />

      <div className="flex flex-grow flex-col justify-between p-4">
        <h2 className="mb-2 line-clamp-3 text-lg">
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
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer hover:text-red-400"
            >
              <Heart
                fill={isFavorite ? "red" : "none"}
                stroke={isFavorite ? "red" : "currentColor"}
              />
            </Button>

            <Button
              size="sm"
              className="flex-grow cursor-pointer"
              onClick={handleWatchlist}
            >
              {cardType === "remove" || addedAnimeToWatchlist === anime.id ? (
                <>
                  <Bookmark className="fill-bg-dark" />{" "}
                  <span>Remove from watchlist</span>
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
  );
}
