import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userEvent from '@testing-library/user-event'
import CountryAutocomplete from '../src/components/CountryAutocomplete'
import countriesReducer from '../src/store/countriesSlice'

const mockStore = configureStore({
  reducer: {
    countries: countriesReducer,
  },
})

describe('CountryAutocomplete', () => {
  test('renders input field', () => {
    render(
      <Provider store={mockStore}>
        <CountryAutocomplete />
      </Provider>
    )

    expect(screen.getByPlaceholderText(/select a country/i)).toBeInTheDocument()
  })

  test('shows suggestions when typing', async () => {
    const user = userEvent.setup()
    render(
      <Provider store={mockStore}>
        <CountryAutocomplete />
      </Provider>
    )

    const input = screen.getByPlaceholderText(/select a country/i)
    await user.type(input, 'unit')

    expect(await screen.findByText('United States')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
  })

  test('selects suggestion on click', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()

    render(
      <Provider store={mockStore}>
        <CountryAutocomplete onChange={mockOnChange} />
      </Provider>
    )

    const input = screen.getByPlaceholderText(/select a country/i)
    await user.type(input, 'unit')
    
    const suggestion = await screen.findByText('United States')
    await user.click(suggestion)

    expect(mockOnChange).toHaveBeenCalledWith('United States')
    expect(input).toHaveValue('United States')
  })

  test('hides suggestions when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <Provider store={mockStore}>
        <div>
          <CountryAutocomplete />
          <div data-testid="outside-area">Outside area</div>
        </div>
      </Provider>
    )

    const input = screen.getByPlaceholderText(/select a country/i)
    await user.type(input, 'unit')
    
    expect(await screen.findByText('United States')).toBeInTheDocument()
    
    // Кликаем вне автокомплита
    await user.click(screen.getByTestId('outside-area'))
    
    // Ждем скрытия suggestions (они скрываются с задержкой)
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument()
    })
  })
})