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
  const [currentlyFetching, setCurrentlyFetching] = useState(false);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [getAnimeById, { loading, error }] = useLazyQuery(GET_ANIME_BY_ID);
  const [titleType, setTitleType] = useState<"romaji" | "english">("english");
  const [watchlistFromDB] = useFetchWatchlist();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setCurrentlyFetching(true);
      if (!watchlistFromDB.length) return;

      setAnimeList([]);

      const batchSize = 10;
      const animeData: Anime[] = [];

      for (let i = 0; i < watchlistFromDB.length; i += batchSize) {
        const batch = watchlistFromDB.slice(i, i + batchSize);

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

      setAnimeList(animeData);
      setCurrentlyFetching(false);
    };

    fetchAnimeDetails();
  }, [watchlistFromDB, getAnimeById]);

  if (loading || currentlyFetching) {
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

  if (!animeList.length && !loading && !error && !currentlyFetching) {
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
        {animeList?.map((anime: Anime) => (
          <div key={anime.id}>
            <AnimeCard
              anime={anime}
              titleType={titleType}
              cardType="watchlist"
              setAnimeList={setAnimeList}
            />
          </div>
        ))}
      </div>
    </>
  );
}
