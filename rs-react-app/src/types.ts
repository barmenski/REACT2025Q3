export type Character = {
  id: number;
  name: string;
  image: string;
  species: string;
  type: string;
  checked: boolean;
};

export type CharactersResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};
