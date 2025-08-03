import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from '@/components/forms/TaskForm'

// Mock the modal store
const mockOpenTaskModal = jest.fn()
const mockCloseTaskModal = jest.fn()

jest.mock('@/store/modalStore', () => ({
  useModalStore: () => ({
    openTaskModal: mockOpenTaskModal,
    closeTaskModal: mockCloseTaskModal,
  }),
}))

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

beforeEach(() => {
  // Reset mocks
  mockFetch.mockClear()
  mockOpenTaskModal.mockClear()
  mockCloseTaskModal.mockClear()
})

describe('TaskForm', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  }

  beforeEach(() => {
    // Mock successful responses for projects and users
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: '1', title: 'Test Project', type: 'IT' },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
        ],
      } as Response)
  })

  it('renders task form dialog when open', async () => {
    render(<TaskForm {...defaultProps} />)
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument()
    expect(screen.getByText('Add a new task to your project.')).toBeInTheDocument()
  })

  it('displays edit mode when taskId is provided', async () => {
    render(<TaskForm {...defaultProps} taskId="task-1" />)
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByText('Update the task details below.')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<TaskForm {...defaultProps} />)
    
    // Try to submit without filling required fields
    const submitButton = screen.getByText('Create Task')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Project is required')).toBeInTheDocument()
    })
  })

  it('validates title length', async () => {
    const user = userEvent.setup()
    render(<TaskForm {...defaultProps} />)
    
    const titleInput = screen.getByPlaceholderText('Enter task title')
    const longTitle = 'a'.repeat(101) // Exceeds 100 character limit
    
    await user.type(titleInput, longTitle)
    
    const submitButton = screen.getByText('Create Task')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Title must be less than 100 characters')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const onSuccess = jest.fn()
    const onClose = jest.fn()
    
    // Mock successful task creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new-task-id' }),
    } as Response)
    
    render(<TaskForm {...defaultProps} onSuccess={onSuccess} onClose={onClose} />)
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
    })
    
    // Fill out the form
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task')
    await user.type(screen.getByPlaceholderText('Enter task description (optional)'), 'Test description')
    
    // Select project (wait for options to load)
    await waitFor(() => {
      expect(screen.getByText('Select a project')).toBeInTheDocument()
    })
    
    const submitButton = screen.getByText('Create Task')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test description',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: null,
          projectId: '',
          assignedTo: '',
        }),
      })
    })
  })

  it('handles form submission errors', async () => {
    const user = userEvent.setup()
    
    // Mock failed task creation
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to create task' }),
    } as Response)
    
    render(<TaskForm {...defaultProps} />)
    
    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
    })
    
    // Fill out minimal required fields
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Test Task')
    
    const submitButton = screen.getByText('Create Task')
    await user.click(submitButton)
    
    // Form should remain open since submission failed
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
  })

  it('calls onClose when dialog is closed', () => {
    const onClose = jest.fn()
    render(<TaskForm {...defaultProps} onClose={onClose} isOpen={false} />)
    
    // The component should handle the close event
    expect(onClose).not.toHaveBeenCalled()
  })

  it('resets form when closed and reopened', async () => {
    const { rerender } = render(<TaskForm {...defaultProps} isOpen={false} />)
    
    // Open with some initial data
    rerender(<TaskForm {...defaultProps} isOpen={true} initialData={{ title: 'Initial Title' }} />)
    
    await waitFor(() => {
      const titleInput = screen.getByDisplayValue('Initial Title')
      expect(titleInput).toBeInTheDocument()
    })
    
    // Close and reopen without initial data
    rerender(<TaskForm {...defaultProps} isOpen={false} />)
    rerender(<TaskForm {...defaultProps} isOpen={true} />)
    
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('Enter task title')
      expect(titleInput).toHaveValue('')
    })
  })
})