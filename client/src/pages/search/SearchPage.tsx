import { useState } from "react";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import SearchInput from "./_components/search-input";
import { TriangleAlert } from "lucide-react";
import Loading from "@/components/loading";
import AnimeCard from "@/components/anime-card";
import { Anime } from "@/types/anime";

const GET_ANIME_LIST = gql`
  query ($search: String, $page: Int) {
    Page(perPage: 15, page: $page) {
      media(search: $search, type: ANIME) {
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
      pageInfo {
        hasNextPage
        total
      }
    }
  }
`;

const GET_POPULAR_ANIME = gql`
  query ($page: Int) {
    Page(perPage: 10, page: $page) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        coverImage {
          extraLarge
        }
        episodes
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
      pageInfo {
        hasNextPage
        total
      }
    }
  }
`;

export default function SearchPage() {
  const [titleType, setTitleType] = useState<"romaji" | "english">("english");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");

  // For show more feature
  const [currentPage, setCurrentPage] = useState(1);
  const [showMoreLoading, setShowMoreLoading] = useState(false);

  // For popular anime AniList query
  const {
    data: popularData,
    error: popularError,
    loading: popularLoading,
    fetchMore: fetchMorePopular,
  } = useQuery<{
    Page: { media: Anime[]; pageInfo: { hasNextPage: boolean; total: number } };
  }>(GET_POPULAR_ANIME, {
    variables: { page: 1 },
  });

  // For search anime AniList query
  const [
    triggerSearch,
    { data: searchData, error: searchError, loading: searchLoading, fetchMore },
  ] = useLazyQuery<{
    Page: { media: Anime[]; pageInfo: { hasNextPage: boolean; total: number } };
  }>(GET_ANIME_LIST);

  const animeList = searchTriggered
    ? searchData?.Page?.media
    : popularData?.Page?.media;

  const hasNextPage = searchTriggered
    ? searchData?.Page?.pageInfo?.hasNextPage
    : popularData?.Page?.pageInfo?.hasNextPage;

  const handleShowMore = () => {
    setShowMoreLoading(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    if (searchTriggered) {
      fetchMore({
        variables: { search: currentSearch, page: nextPage },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            Page: {
              ...fetchMoreResult.Page,
              media: [...prev.Page.media, ...fetchMoreResult.Page.media],
            },
          };
        },
      }).finally(() => {
        setShowMoreLoading(false);
      });
    } else {
      fetchMorePopular({
        variables: { page: nextPage },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            Page: {
              ...fetchMoreResult.Page,
              media: [...prev.Page.media, ...fetchMoreResult.Page.media],
            },
          };
        },
      }).finally(() => {
        setShowMoreLoading(false);
      });
    }
  };

  return (
    <div className="w-full pt-6 pb-6">
      <SearchInput
        triggerSearch={(search) => {
          setSearchTriggered(true);
          setCurrentPage(1);
          setCurrentSearch(search);
          triggerSearch({ variables: { search, page: 1 } });
        }}
      />

      {(searchLoading || popularLoading) && (
        <div className="grid h-[28rem] w-full place-items-center md:h-[25rem] 2xl:h-[34rem]">
          <Loading />
        </div>
      )}

      {searchData?.Page.media?.length === 0 &&
        !searchLoading &&
        !popularLoading &&
        !searchError &&
        !popularError && (
          <div className="grid h-[28rem] w-full place-items-center md:h-[25rem] 2xl:h-[34rem]">
            <p>No anime found</p>
          </div>
        )}

      {(searchError || (popularError && !searchData)) && (
        <div className="grid h-[28rem] w-full place-items-center md:h-[25rem] 2xl:h-[34rem]">
          <p className="bg-destructive flex items-center gap-2 rounded px-4 py-2">
            <TriangleAlert />{" "}
            <span>Error: {searchError?.message || popularError?.message}</span>
          </p>
        </div>
      )}

      {searchData?.Page.media?.length !== 0 &&
        !searchLoading &&
        !popularLoading &&
        !searchError && (
          <>
            <div className="mb-4 flex items-center gap-2">
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
            <div className="grid gap-6 pb-10 md:grid-cols-3 md:pb-0 lg:grid-cols-5">
              {animeList?.map((anime: Anime) => (
                <div key={anime.id}>
                  <AnimeCard
                    anime={anime}
                    titleType={titleType}
                    cardType="search"
                  />
                </div>
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-8 flex h-20 items-center justify-center">
                {searchLoading || popularLoading || showMoreLoading ? (
                  <Loading />
                ) : (
                  <Button
                    onClick={handleShowMore}
                    variant="outline"
                    disabled={searchLoading || popularLoading}
                    className="cursor-pointer px-6"
                  >
                    Show more
                  </Button>
                )}
              </div>
            )}
          </>
        )}
    </div>
  );
}
