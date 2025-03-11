export type Anime = {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
  };
  coverImage: {
    extraLarge: string;
  };
  description?: string;
  episodes?: number;
  format?: string;
  genres?: string[];
  startDate?: {
    year?: number;
  };
  status?: string;
};
