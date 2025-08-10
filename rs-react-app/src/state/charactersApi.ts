import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Character, CharactersResponse } from '../types';

export const charactersApi = createApi({
  reducerPath: 'charactersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/',
  }),
  tagTypes: ['Characters', 'Character'],
  endpoints: (builder) => ({
    getCharacters: builder.query<
      CharactersResponse,
      { name?: string; page?: number }
    >({
      query: ({ name = '', page = 1 }) =>
        `character/?name=${encodeURIComponent(name)}&page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Character' as const,
                id,
              })),
              { type: 'Characters', id: 'LIST' },
            ]
          : [{ type: 'Characters', id: 'LIST' }],
    }),
    getCharacterById: builder.query<Character, number>({
      query: (id) => `character/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
    invalidateCharacters: builder.mutation<undefined, undefined>({
      queryFn: () => ({ data: undefined }),
      invalidatesTags: [{ type: 'Characters', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
  useInvalidateCharactersMutation,
} = charactersApi;
