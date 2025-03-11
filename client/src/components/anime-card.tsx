import { Anime } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, Trash } from "lucide-react";

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
  return (
    <div className="hover:ring-primary-light dark:hover:ring-primary-dark flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:ring dark:bg-gray-900">
      <img
        src={anime.coverImage.extraLarge}
        alt={anime.title.romaji}
        height={385}
        className="h-[385px] w-full object-cover"
      />
      <div className="flex flex-grow flex-col justify-between p-4">
        <div>
          <h2
            className="mb-2 line-clamp-3 text-lg"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {titleType === "english"
              ? anime.title.english || anime.title.romaji
              : anime.title.romaji}
          </h2>
        </div>
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              {anime.format === "MOVIE"
                ? "Movie"
                : anime.episodes
                  ? `${anime.episodes} ${anime.episodes > 1 ? "Episodes" : "Episode"}`
                  : "Ep count unknown"}
            </div>
            <div>{anime.startDate?.year ?? "No date"}</div>
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
              className="cursor-pointer bg-transparent hover:bg-transparent hover:text-red-400"
            >
              {isFavorite ? <Heart fill="red" stroke="red" /> : <Heart />}
            </Button>
            <Button size="sm" className="flex-grow cursor-pointer">
              {cardType === "add" && <Bookmark />}
              {cardType === "remove" && <Trash />}
              <span>
                {cardType === "add" && "Add to watchlist"}
                {cardType === "remove" && "Remove to watchlist"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
