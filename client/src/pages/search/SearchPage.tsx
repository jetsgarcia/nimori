import { useState } from "react";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { Button } from "@/components/ui/button";
import SearchInput from "./_components/search-input";
import { TriangleAlert } from "lucide-react";
import Loading from "@/components/loading";
import AnimeCard from "@/components/anime-card";
import { Anime } from "@/types/anime";

const GET_ANIME_LIST = gql`
  query ($search: String) {
    Page(perPage: 15) {
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
    }
  }
`;

const GET_POPULAR_ANIME = gql`
  query {
    Page(perPage: 10) {
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
    }
  }
`;

export default function SearchPage() {
  const [titleType, setTitleType] = useState<"romaji" | "english">("english");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const {
    data: popularData,
    error: popularError,
    loading: popularLoading,
  } = useQuery<{
    Page: { media: Anime[] };
  }>(GET_POPULAR_ANIME);

  const [
    triggerSearch,
    { data: searchData, error: searchError, loading: searchLoading },
  ] = useLazyQuery<{
    Page: { media: Anime[] };
  }>(GET_ANIME_LIST);

  const animeList = searchTriggered
    ? searchData?.Page?.media
    : popularData?.Page?.media;

  return (
    <div className="w-full pt-6 pb-6">
      <SearchInput
        triggerSearch={(search) => {
          setSearchTriggered(true);
          triggerSearch({ variables: { search } });
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

      {searchData?.Page.media?.length !== 0 && !searchLoading && (
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
              <AnimeCard
                anime={anime}
                titleType={titleType}
                cardType="add"
                isFavorite={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
