import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  charactersApi,
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
  useInvalidateCharactersMutation,
} from '../src/state/charactersApi';

// Функция для создания mock Response с нужным интерфейсом
const createMockResponse = <T,>(data: T): Response => {
  const body = JSON.stringify(data);

  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    url: '',
    redirected: false,
    type: 'default',
    bodyUsed: false,

    clone() {
      return this;
    },

    async json() {
      return data;
    },

    async text() {
      return body;
    },

    async arrayBuffer() {
      return new ArrayBuffer(0);
    },

    async blob() {
      return new Blob();
    },

    async formData() {
      return new FormData();
    },
  } as unknown as Response;
};

// Создаем стор с RTK Query api reducer
const store = configureStore({
  reducer: {
    [charactersApi.reducerPath]: charactersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(charactersApi.middleware),
});

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('charactersApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches characters list successfully', async () => {
    const mockData = {
      info: { count: 1, pages: 1 },
      results: [{ id: 1, name: 'Rick Sanchez' }],
    };

    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve(createMockResponse(mockData))
    );

    const TestComponent = () => {
      const { data, error, isLoading } = useGetCharactersQuery({
        name: '',
        page: 1,
      });

      if (isLoading) return <div>Loading...</div>;
      if (error) return <div>Error</div>;

      return (
        <div>
          <div>Count: {data?.info.count}</div>
          {data?.results.map((char) => (
            <div key={char.id}>Name: {char.name}</div>
          ))}
        </div>
      );
    };

    render(<TestComponent />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
      expect(screen.getByText('Name: Rick Sanchez')).toBeInTheDocument();
    });
  });

  it('fetches character by id successfully', async () => {
    const mockCharacter = { id: 1, name: 'Rick Sanchez' };

    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve(createMockResponse(mockCharacter))
    );

    const TestComponent = () => {
      const { data, error, isLoading } = useGetCharacterByIdQuery(1);

      if (isLoading) return <div>Loading...</div>;
      if (error) return <div>Error</div>;

      return <div>Name: {data?.name}</div>;
    };

    render(<TestComponent />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('Name: Rick Sanchez')).toBeInTheDocument();
    });
  });

  it('invalidateCharactersMutation triggers invalidation', async () => {
    const TestComponent = () => {
      const [invalidateCharacters, { isLoading, isSuccess }] =
        useInvalidateCharactersMutation();

      React.useEffect(() => {
        invalidateCharacters(undefined);
      }, [invalidateCharacters]);

      if (isLoading) return <div>Loading...</div>;
      if (isSuccess) return <div>Done</div>;

      return null;
    };

    render(<TestComponent />, { wrapper: Wrapper });
  });
});
