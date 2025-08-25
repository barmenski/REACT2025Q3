import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../src/components/Modal'

describe('Modal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  test('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  test('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    )

    await user.click(screen.getByText('✕'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('calls onClose when ESC key is pressed', async () => {
    const user = userEvent.setup()
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    )

    await user.keyboard('{Escape}')
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('calls onClose when clicking outside modal', async () => {
    const user = userEvent.setup()
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    )

    const modalBackground = screen.getByTestId('modal-background')
    await user.click(modalBackground)
    expect(mockOnClose).toHaveBeenCalled()
  })
})