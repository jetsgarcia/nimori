import { Anime } from "./anime";

export type AnimeQueryResponse = {
  Page: {
    media: Anime[];
  };
};
