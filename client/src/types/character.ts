export type Character = {
  description: string;
  favourites: number;
  id: number;
  image: {
    large: string;
  };
  name: {
    alternative?: string[];
    full: string;
  };
};
