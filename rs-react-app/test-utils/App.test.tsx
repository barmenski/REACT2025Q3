import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import countriesReducer from '../src/store/countriesSlice'
import formReducer from '../src/store/formSlice'

const mockStore = configureStore({
  reducer: {
    countries: countriesReducer,
    form: formReducer,
  },
})

describe('App', () => {
  test('renders header and buttons', () => {
    render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    )

    expect(screen.getByText(/Open Uncontrolled Form/i)).toBeInTheDocument()
    expect(screen.getByText(/Open Controlled Form/i)).toBeInTheDocument()
  })

  test('opens uncontrolled form modal', async () => {
    const user = userEvent.setup()
    render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    )

    await user.click(screen.getByText(/Open Uncontrolled Form/i))

    // шукаем загаловак формы па ролі heading
    expect(
      screen.getByRole('heading', { name: /Uncontrolled Form/i })
    ).toBeInTheDocument()
  })

  test('opens controlled form modal', async () => {
    const user = userEvent.setup()
    render(
      <Provider store={mockStore}>
        <App />
      </Provider>
    )

    await user.click(screen.getByText(/Open Controlled Form/i))

    expect(
      screen.getByRole('heading', { name: /Controlled Form/i })
    ).toBeInTheDocument()
  })
})
