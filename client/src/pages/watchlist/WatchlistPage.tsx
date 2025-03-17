import { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Anime } from "@/types/anime";
import Loading from "@/components/loading";
import { TriangleAlert } from "lucide-react";
import AnimeCard from "@/components/anime-card";
import { Button } from "@/components/ui/button";
import useFetchWatchlist from "@/hooks/useFetchWatchlist";

const GET_ANIME_BY_ID = gql`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      coverImage {
        extraLarge
      }
      episodes
      format
      genres
      id
      startDate {
        year
      }
      status
      title {
        romaji
        english
      }
    }
  }
`;

export default function WatchlistPage() {
  // For loading state
  const [currentlyFetchingWatchlist, setCurrentlyFetchingWatchlist] =
    useState(true);
  const [currentlyFetchingWatchingList, setCurrentlyFetchingWatchingList] =
    useState(true);
  const [currentlyFetchingWatchedList, setCurrentlyFetchingWatchedList] =
    useState(true);

  // For storing anime data
  const [animeWatchlist, setAnimeWatchlist] = useState<Anime[]>([]);
  const [animeWatchingList, setAnimeWatchingList] = useState<Anime[]>([]);
  const [animeWatchedList, setAnimeWatchedList] = useState<Anime[]>([]);

  // AniList query
  const [getAnimeById, { loading, error }] = useLazyQuery(GET_ANIME_BY_ID);

  const [titleType, setTitleType] = useState<"romaji" | "english">("english");
  const [watchlistFromDB, watchingListFromDB, watchedListFromDB] =
    useFetchWatchlist();

  useEffect(() => {
    async function fetchAnimeDetails({ animeList }: { animeList: number[] }) {
      const batchSize = 30;
      const animeData: Anime[] = [];

      for (let i = 0; i < animeList.length; i += batchSize) {
        const batch = animeList.slice(i, i + batchSize);

        const batchPromises = batch.map((animeId) =>
          getAnimeById({ variables: { id: animeId } })
            .then(({ data }) => data?.Media as Anime)
            .catch((error) => {
              console.error(`Error fetching anime with id ${animeId}:`, error);
              return null;
            }),
        );

        const batchResults = await Promise.all(batchPromises);
        animeData.push(
          ...batchResults.filter((result): result is Anime => result !== null),
        );
      }

      return animeData;
    }

    if (!watchlistFromDB.length) {
      setCurrentlyFetchingWatchlist(false);
    } else {
      fetchAnimeDetails({ animeList: watchlistFromDB }).then((animeData) => {
        setAnimeWatchlist(animeData);
        setCurrentlyFetchingWatchlist(false);
      });
    }
    if (!watchingListFromDB.length) {
      setCurrentlyFetchingWatchingList(false);
    } else {
      fetchAnimeDetails({ animeList: watchingListFromDB }).then((animeData) => {
        setAnimeWatchingList(animeData);
        setCurrentlyFetchingWatchingList(false);
      });
    }
    if (!watchedListFromDB.length) {
      setCurrentlyFetchingWatchedList(false);
    } else {
      fetchAnimeDetails({ animeList: watchedListFromDB }).then((animeData) => {
        setAnimeWatchedList(animeData);
        setCurrentlyFetchingWatchedList(false);
      });
    }
  }, [getAnimeById, watchlistFromDB, watchingListFromDB, watchedListFromDB]);

  if (
    loading ||
    currentlyFetchingWatchlist ||
    currentlyFetchingWatchingList ||
    currentlyFetchingWatchedList
  ) {
    return (
      <div className="grid h-[40rem] w-full place-items-center md:h-[32rem] 2xl:h-[41rem]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid h-[40rem] w-full place-items-center md:h-[32rem] 2xl:h-[41rem]">
        <p className="bg-destructive flex items-center gap-2 rounded px-4 py-2">
          <TriangleAlert /> <span>Error: {error?.message}</span>
        </p>
      </div>
    );
  }

  if (
    animeWatchlist.length <= 0 &&
    animeWatchingList.length <= 0 &&
    animeWatchedList.length <= 0 &&
    !loading &&
    !error &&
    !currentlyFetchingWatchlist &&
    !currentlyFetchingWatchingList &&
    !currentlyFetchingWatchedList
  ) {
    return (
      <div className="grid h-[40rem] w-full place-items-center md:h-[32rem] 2xl:h-[41rem]">
        Your watchlist is empty
      </div>
    );
  }

  return (
    <>
      <div className="my-4 flex items-center gap-2">
        <p className="mr-2">Customize title:</p>
        <Button
          variant={titleType === "english" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setTitleType("english")}
        >
          English
        </Button>
        <Button
          variant={titleType === "romaji" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setTitleType("romaji")}
        >
          Romaji
        </Button>
      </div>
      <div className="grid gap-6 pb-10 md:grid-cols-3 md:pb-4 lg:grid-cols-5">
        {animeWatchlist?.map((anime: Anime) => (
          <div key={anime.id}>
            <AnimeCard
              anime={anime}
              titleType={titleType}
              cardType="watchlist"
              setAnimeList={setAnimeWatchlist}
            />
          </div>
        ))}
        {animeWatchingList?.map((anime: Anime) => (
          <div key={anime.id}>
            <AnimeCard
              anime={anime}
              titleType={titleType}
              cardType="watchlist"
              setAnimeList={setAnimeWatchingList}
            />
          </div>
        ))}
        {animeWatchedList?.map((anime: Anime) => (
          <div key={anime.id}>
            <AnimeCard
              anime={anime}
              titleType={titleType}
              cardType="watchlist"
              setAnimeList={setAnimeWatchedList}
            />
          </div>
        ))}
      </div>
    </>
  );
}
