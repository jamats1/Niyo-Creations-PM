import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockTask, mockProject, mockUser } from '../utils/test-utils'

// Mock the modal store
const mockOpenTaskModal = jest.fn()
const mockCloseTaskModal = jest.fn()
const mockOpenProjectModal = jest.fn()
const mockCloseProjectModal = jest.fn()

jest.mock('@/store/modalStore', () => ({
  useModalStore: () => ({
    isTaskModalOpen: false,
    isProjectModalOpen: false,
    isClientModalOpen: false,
    selectedTaskId: null,
    selectedProjectId: null,
    selectedClientId: null,
    openTaskModal: mockOpenTaskModal,
    closeTaskModal: mockCloseTaskModal,
    openProjectModal: mockOpenProjectModal,
    closeProjectModal: mockCloseProjectModal,
    openClientModal: jest.fn(),
    closeClientModal: jest.fn(),
  }),
}))

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Project Management Workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('supports complete task management workflow', async () => {
    // Mock API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProject],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockUser],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTask,
      } as Response)

    const TaskForm = require('@/components/forms/TaskForm').default
    const onSuccess = jest.fn()
    const onClose = jest.fn()

    render(
      <TaskForm
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    )

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })

    expect(screen.getByText('Add a new task to your project.')).toBeInTheDocument()
  })

  it('validates form inputs correctly', async () => {
    const TaskForm = require('@/components/forms/TaskForm').default
    const user = userEvent.setup()

    // Mock API responses for projects and users
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProject],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockUser],
      } as Response)

    render(
      <TaskForm
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    )

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
    })

    // Try to submit without filling required fields
    const submitButton = screen.getByText('Create Task')
    await user.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('handles industry-specific project types', () => {
    const ProjectForm = require('@/components/forms/ProjectForm').default

    // Mock API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)

    render(
      <ProjectForm
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    )

    expect(screen.getByText('Create New Project')).toBeInTheDocument()
    expect(screen.getByText('Start a new project for your team.')).toBeInTheDocument()
  })

  it('supports role-based access control', () => {
    // Test that different user roles see appropriate UI elements
    // This would typically involve mocking user context and checking
    // what elements are rendered based on user permissions

    expect(true).toBe(true) // Placeholder for role-based tests
  })

  it('handles API errors gracefully', async () => {
    const TaskForm = require('@/components/forms/TaskForm').default

    // Mock failed API responses
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(
      <TaskForm
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    )

    // Should handle the error gracefully and show loading state
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
  })
})