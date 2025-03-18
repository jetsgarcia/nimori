import { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Anime } from "@/types/anime";
import Loading from "@/components/loading";
import { TriangleAlert } from "lucide-react";
import AnimeCard from "@/components/anime-card";
import { Button } from "@/components/ui/button";
import useFetchWatchlist from "@/hooks/useFetchWatchlist";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/clerk-react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GET_ANIME_BY_IDS = gql`
  query ($ids: [Int!]!) {
    Page {
      media(id_in: $ids, type: ANIME) {
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
  }
`;

export default function WatchlistPage() {
  const [titleType, setTitleType] = useState<"romaji" | "english">("english");
  const {
    watchlistFromDB,
    watchingListFromDB,
    watchedListFromDB,
    fetchFromDBLoading,
    refetchWatchlist,
  } = useFetchWatchlist();

  // Retrieve information from clerk auth
  const { getToken } = useAuth();
  const { user } = useUser();

  // For loading state
  const [currentlyFetchingWatchlist, setCurrentlyFetchingWatchlist] =
    useState(true);
  const [currentlyFetchingWatchingList, setCurrentlyFetchingWatchingList] =
    useState(true);
  const [currentlyFetchingWatchedList, setCurrentlyFetchingWatchedList] =
    useState(true);
  const [loadMore, setLoadMore] = useState(false);

  // For toggling watch status view
  const [viewWatchlist, setViewWatchlist] = useState(true);
  const [viewWatchingList, setViewWatchingList] = useState(true);
  const [viewWatchedList, setViewWatchedList] = useState(true);

  // For storing anime data
  const [animeWatchlist, setAnimeWatchlist] = useState<Anime[]>([]);
  const [animeWatchingList, setAnimeWatchingList] = useState<Anime[]>([]);
  const [animeWatchedList, setAnimeWatchedList] = useState<Anime[]>([]);

  // For lazy loading (Pagination)
  const [watchlistItems, setWatchlistItems] = useState(0);
  const [watchingListItems, setWatchingListItems] = useState(0);
  const [watchedListItems, setWatchedListItems] = useState(0);

  // AniList query
  const [getAnimeByIds, { loading, error }] = useLazyQuery(GET_ANIME_BY_IDS);

  // For API call which is used in handleWatchStatusChange
  async function addAnimeToAList(animeId: number, list: string) {
    if (!user) return toast.error("User not found. Please sign in.");
    const errorMessage = "Failed to remove anime to watchlist.";
    const url = `${apiBaseUrl}/api/users/${user.id}/${list}`;
    const token = await getToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ data: { animeId } }),
    });
    if (!response.ok) return toast.error(errorMessage);
  }

  async function handleWatchStatusChange(
    newStatus: "toWatch" | "watching" | "watched",
    animeId: number,
    currentList: "toWatch" | "watching" | "watched",
  ) {
    if (!user) return toast.error("User not found. Please sign in.");
    const errorMessage = "Failed to update anime status.";

    try {
      // Don't update if status hasn't changed
      if (newStatus === currentList) return;

      // Make API call based on the new status
      if (newStatus === "toWatch") {
        await addAnimeToAList(animeId, "watchlist");
      } else if (newStatus === "watching") {
        await addAnimeToAList(animeId, "watching");
      } else if (newStatus === "watched") {
        await addAnimeToAList(animeId, "watched");
      }

      // Update local state - remove from current list and refetch to refresh lists
      refetchWatchlist();

      // Update UI immediately for better UX
      if (currentList === "toWatch") {
        setAnimeWatchlist(
          animeWatchlist.filter((anime) => anime.id !== animeId),
        );
      } else if (currentList === "watching") {
        setAnimeWatchingList(
          animeWatchingList.filter((anime) => anime.id !== animeId),
        );
      } else if (currentList === "watched") {
        setAnimeWatchedList(
          animeWatchedList.filter((anime) => anime.id !== animeId),
        );
      }
    } catch {
      toast.error(errorMessage);
    }
  }

  async function fetchAnimeDetails({ animeList }: { animeList: number[] }) {
    const batchSize = 100;
    const animeData: Anime[] = [];

    for (let i = 0; i < animeList.length; i += batchSize) {
      const batch = animeList.slice(i, i + batchSize);

      try {
        const { data } = await getAnimeByIds({ variables: { ids: batch } });
        animeData.push(...(data?.Page?.media || []));
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    }

    return animeData;
  }

  // For initial fetching of first five anime details in each watch status
  useEffect(() => {
    if (!watchlistFromDB.length) {
      setCurrentlyFetchingWatchlist(false);
    } else {
      const animeToFetch = watchlistFromDB.slice(
        watchlistItems,
        watchlistItems + 100,
      );
      fetchAnimeDetails({ animeList: animeToFetch }).then((animeData) => {
        setAnimeWatchlist(animeData);
        setCurrentlyFetchingWatchlist(false);
      });
    }
  }, [watchlistFromDB]);
  useEffect(() => {
    if (!watchingListFromDB.length) {
      setCurrentlyFetchingWatchingList(false);
    } else {
      const animeToFetch = watchingListFromDB.slice(
        watchingListItems,
        watchingListItems + 100,
      );
      fetchAnimeDetails({ animeList: animeToFetch }).then((animeData) => {
        setAnimeWatchingList(animeData);
        setCurrentlyFetchingWatchingList(false);
      });
    }
  }, [watchingListFromDB]);
  useEffect(() => {
    if (!watchedListFromDB.length) {
      setCurrentlyFetchingWatchedList(false);
    } else {
      const animeToFetch = watchedListFromDB.slice(
        watchedListItems,
        watchedListItems + 100,
      );
      fetchAnimeDetails({ animeList: animeToFetch }).then((animeData) => {
        setAnimeWatchedList(animeData);
        setCurrentlyFetchingWatchedList(false);
        setLoadMore(false);
      });
    }
  }, [watchedListFromDB]);

  // For lazy loading (+100 anime per watch status)
  useEffect(() => {
    if (watchlistItems >= 100) {
      const animeToFetch = watchlistFromDB.slice(
        watchlistItems,
        watchlistItems + 100,
      );

      // Avoid duplicate fetching
      const alreadyFetchedIds = new Set(
        animeWatchlist.map((anime) => anime.id),
      );
      const newAnimeToFetch = animeToFetch.filter(
        (id) => !alreadyFetchedIds.has(id),
      );

      if (newAnimeToFetch.length > 0) {
        fetchAnimeDetails({ animeList: newAnimeToFetch }).then((animeData) => {
          setAnimeWatchlist((prev) => [...prev, ...animeData]);
          setCurrentlyFetchingWatchlist(false);
          setLoadMore(false);
        });
      }
    }
  }, [watchlistItems]);
  useEffect(() => {
    if (watchingListItems >= 100) {
      const animeToFetch = watchingListFromDB.slice(
        watchingListItems,
        watchingListItems + 100,
      );

      // Avoid duplicate fetching
      const alreadyFetchedIds = new Set(
        animeWatchlist.map((anime) => anime.id),
      );
      const newAnimeToFetch = animeToFetch.filter(
        (id) => !alreadyFetchedIds.has(id),
      );

      if (newAnimeToFetch.length > 0) {
        fetchAnimeDetails({ animeList: newAnimeToFetch }).then((animeData) => {
          setAnimeWatchingList((prev) => [...prev, ...animeData]);
          setCurrentlyFetchingWatchingList(false);
          setLoadMore(false);
        });
      }
    }
  }, [watchingListItems]);
  useEffect(() => {
    if (watchedListItems >= 100) {
      const animeToFetch = watchingListFromDB.slice(
        watchedListItems,
        watchedListItems + 100,
      );

      // Avoid duplicate fetching
      const alreadyFetchedIds = new Set(
        animeWatchlist.map((anime) => anime.id),
      );
      const newAnimeToFetch = animeToFetch.filter(
        (id) => !alreadyFetchedIds.has(id),
      );

      if (newAnimeToFetch.length > 0) {
        fetchAnimeDetails({ animeList: newAnimeToFetch }).then((animeData) => {
          setAnimeWatchedList((prev) => [...prev, ...animeData]);
          setCurrentlyFetchingWatchedList(false);
        });
      }
    }
  }, [watchedListItems]);

  if (
    (loading && currentlyFetchingWatchlist && !loadMore) ||
    (currentlyFetchingWatchingList && !loadMore) ||
    (currentlyFetchingWatchedList && !loadMore) ||
    fetchFromDBLoading
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
    watchlistFromDB.length <= 0 &&
    watchingListFromDB.length <= 0 &&
    watchedListFromDB.length <= 0 &&
    !loading &&
    !error &&
    !currentlyFetchingWatchlist &&
    !currentlyFetchingWatchingList &&
    !currentlyFetchingWatchedList &&
    !fetchFromDBLoading
  ) {
    return (
      <div className="grid h-[40rem] w-full place-items-center md:h-[32rem] 2xl:h-[41rem]">
        Your watchlist is empty
      </div>
    );
  }

  return (
    <>
      <div className="my-4 flex flex-wrap items-center gap-2 md:my-0 md:gap-6">
        <div className="flex flex-col gap-2 md:my-4 md:flex-row md:items-center">
          <p className="mr-2">Customize title:</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={titleType === "english" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setTitleType("english")}
            >
              English
            </Button>
            <Button
              size="sm"
              variant={titleType === "romaji" ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setTitleType("romaji")}
            >
              Romaji
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <p className="mr-2">View status:</p>
          <div className="flex gap-2">
            <Button
              variant={viewWatchlist ? "default" : "secondary"}
              className="cursor-pointer"
              size="sm"
              onClick={() => setViewWatchlist(!viewWatchlist)}
            >
              To watch
            </Button>
            <Button
              variant={viewWatchingList ? "default" : "secondary"}
              className="cursor-pointer"
              size="sm"
              onClick={() => setViewWatchingList(!viewWatchingList)}
            >
              Watching
            </Button>
            <Button
              variant={viewWatchedList ? "default" : "secondary"}
              className="cursor-pointer"
              size="sm"
              onClick={() => setViewWatchedList(!viewWatchedList)}
            >
              Watched
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {viewWatchlist && (
          <>
            {animeWatchlist?.map((anime: Anime) => (
              <div key={anime.id}>
                <AnimeCard
                  anime={anime}
                  titleType={titleType}
                  cardType="watchlist"
                  setAnimeList={setAnimeWatchlist}
                  handleWatchStatusChange={(newStatus) =>
                    handleWatchStatusChange(newStatus, anime.id, "toWatch")
                  }
                  watchStatus="toWatch"
                />
              </div>
            ))}
          </>
        )}
        {viewWatchingList && (
          <>
            {animeWatchingList?.map((anime: Anime) => (
              <div key={anime.id}>
                <AnimeCard
                  anime={anime}
                  titleType={titleType}
                  cardType="watchlist"
                  setAnimeList={setAnimeWatchingList}
                  handleWatchStatusChange={(newStatus) =>
                    handleWatchStatusChange(newStatus, anime.id, "watching")
                  }
                  watchStatus="watching"
                />
              </div>
            ))}
          </>
        )}

        {viewWatchedList && (
          <>
            {animeWatchedList?.map((anime: Anime) => (
              <div key={anime.id}>
                <AnimeCard
                  anime={anime}
                  titleType={titleType}
                  cardType="watchlist"
                  setAnimeList={setAnimeWatchedList}
                  handleWatchStatusChange={(newStatus) =>
                    handleWatchStatusChange(newStatus, anime.id, "watched")
                  }
                  watchStatus="watched"
                />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="flex h-20 items-center justify-center gap-2">
        {loadMore ? (
          <Loading />
        ) : (
          <>
            {watchlistFromDB.length > watchlistItems + 100 && (
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setLoadMore(true);
                  setWatchlistItems(watchlistItems + 100);
                }}
              >
                Load more "To Watch"
              </Button>
            )}
            {watchingListFromDB.length > watchingListItems + 100 && (
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setLoadMore(true);
                  setWatchingListItems(watchingListItems + 100);
                }}
              >
                Load more "Watching"
              </Button>
            )}
            {watchedListFromDB.length > watchedListItems + 100 && (
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setLoadMore(true);
                  setWatchedListItems(watchedListItems + 100);
                }}
              >
                Load more "Watched"
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
