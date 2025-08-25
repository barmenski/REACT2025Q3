import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import FormSubmissions from '../src/components/FormSubmissions'
import countriesReducer from '../src/store/countriesSlice'
import formReducer from '../src/store/formSlice'


const mockStore = configureStore({
  reducer: {
    form: formReducer,
    countries: countriesReducer,
  },
})

describe('FormSubmissions', () => {
  test('shows empty state when no submissions', () => {
    render(
      <Provider store={mockStore}>
        <FormSubmissions />
      </Provider>
    )

    expect(screen.getByText(/No form submissions yet/i)).toBeInTheDocument()
  })

  test('displays form submissions', () => {
    const storeWithData = configureStore({
      reducer: {
        form: formReducer,
        countries: countriesReducer,
      },
      preloadedState: {
        form: {
          submissions: [
            {
              id: '1',
              name: 'John Doe',
              age: 25,
              email: 'john@example.com',
              gender: 'male',
              terms: true,
              image: 'base64string',
              country: 'USA',
              timestamp: '2023-01-01T00:00:00.000Z',
              isNew: false,
            },
          ],
        },
      },
    })

    render(
      <Provider store={storeWithData}>
        <FormSubmissions />
      </Provider>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})