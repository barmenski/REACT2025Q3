import type { Character } from '../../types';

export type ApiResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

export class CharacterService {
  baseUrl = 'https://rickandmortyapi.com/api/character/';

  async fetchCharacters(query: string): Promise<ApiResponse> {
    const url = `${this.baseUrl}?name=${encodeURIComponent(query)}`;
    return this.fetchFromUrl(url);
  }

  async fetchFromUrl(url: string): Promise<ApiResponse> {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) throw new Error('404: Персонажи не найдены');
      if (response.status === 503)
        throw new Error('503: Сервис временно недоступен');
      throw new Error(`${response.status}: Ошибка сервера`);
    }
    return response.json();
  }

  loadLastQuery(): string {
    return localStorage.getItem('lastQuery') || '';
  }

  saveQuery(query: string) {
    localStorage.setItem('lastQuery', query);
  }
}
