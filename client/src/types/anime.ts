import { Character } from "./character";

export type Anime = {
  bannerImage: string;
  characters: {
    nodes: Character[];
  };
  coverImage: {
    extraLarge: string;
  };
  description: string;
  episodes: number;
  format: string;
  genres: string[];
  id: number;
  startDate: {
    day: number;
    month: number;
    year: number;
  };
  status: string;
  title: {
    english?: string;
    romaji: string;
  };
};
