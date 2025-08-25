import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userEvent from '@testing-library/user-event'
import ControlledForm from '../src/components/ControlledForm'
import countriesReducer from '../src/store/countriesSlice'
import formReducer from '../src/store/formSlice'
import  { forwardRef } from 'react'
vi.mock('../src/components/CountryAutocomplete', () => ({
  default: forwardRef((props: any, ref: any) => (
    <input
      ref={ref}
      placeholder="Select a country"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      onBlur={props.onBlur}
    />
  )),
}));

// --- Створаны Store ---
const mockStore = configureStore({
  reducer: {
    countries: countriesReducer,
    form: formReducer,
  },
})

const mockOnSuccess = vi.fn()

describe('ControlledForm', () => {
  beforeEach(() => {
    mockOnSuccess.mockClear()
  })

  test('renders all form fields', () => {
    render(
      <Provider store={mockStore}>
        <ControlledForm onSuccess={mockOnSuccess} />
      </Provider>
    )

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^retype password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/male/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/female/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /accept terms/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/select a country/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/image/i)).toBeInTheDocument()
  })

  test('validates name field', async () => {
    const user = userEvent.setup()
    render(
      <Provider store={mockStore}>
        <ControlledForm onSuccess={mockOnSuccess} />
      </Provider>
    )

    const nameInput = screen.getByLabelText(/^name$/i)
    await user.type(nameInput, 'invalid name')
    await user.tab()

    expect(await screen.findByText(/first letter must be uppercase/i)).toBeInTheDocument()
  })

  test('disables submit button when form is invalid', async () => {
    render(
      <Provider store={mockStore}>
        <ControlledForm onSuccess={mockOnSuccess} />
      </Provider>
    )

    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()
  })

  test('enables submit button when form is valid', async () => {
    const user = userEvent.setup()
    render(
      <Provider store={mockStore}>
        <ControlledForm onSuccess={mockOnSuccess} />
      </Provider>
    )

    await user.type(screen.getByLabelText(/^name$/i), 'John')
    await user.type(screen.getByLabelText(/^age$/i), '25')
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
    await user.type(screen.getByLabelText(/^retype password$/i), 'Password123!')

    await user.click(screen.getByLabelText(/male/i))
    await user.click(screen.getByRole('checkbox', { name: /accept terms/i }))

    await user.type(screen.getByPlaceholderText(/select a country/i), 'United States')

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  test('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(
      <Provider store={mockStore}>
        <ControlledForm onSuccess={mockOnSuccess} />
      </Provider>
    )

    await user.type(screen.getByLabelText(/^name$/i), 'John')
    await user.type(screen.getByLabelText(/^age$/i), '25')
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
    await user.type(screen.getByLabelText(/^retype password$/i), 'Password123!')

    await user.click(screen.getByLabelText(/male/i))
    await user.click(screen.getByRole('checkbox', { name: /accept terms/i }))

    await user.type(screen.getByPlaceholderText(/select a country/i), 'United States')

    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText(/image/i) as HTMLInputElement
    Object.defineProperty(fileInput, 'files', { value: [file] })
    await user.upload(fileInput, file)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })

    const submitted = mockOnSuccess.mock.calls[0][0]
    expect(submitted.name).toBe('John')
    expect(submitted.age).toBe(25)
    expect(submitted.email).toBe('john@example.com')
    expect(submitted.gender).toBe('male')
    expect(submitted.terms).toBe(true)
    expect(submitted.country).toBe('United States')
    expect(submitted.image).toBeTypeOf('string') // base64
  })
})
