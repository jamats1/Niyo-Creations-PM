import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KanbanBoard from '@/components/KanbanBoard'

// Mock the board store
const mockGetBoard = jest.fn()
const mockMoveTask = jest.fn()

jest.mock('@/store/boardStore', () => ({
  useBoardStore: () => ({
    board: {
      columns: new Map([
        ['TODO', { id: 'TODO', tasks: [
          {
            id: 'task-1',
            title: 'Test Task 1',
            status: 'TODO',
            priority: 'HIGH',
            assignee: { id: '1', name: 'John Doe' },
            project: { id: '1', title: 'Test Project' },
          }
        ]}],
        ['IN_PROGRESS', { id: 'IN_PROGRESS', tasks: [] }],
        ['REVIEW', { id: 'REVIEW', tasks: [] }],
        ['DONE', { id: 'DONE', tasks: [] }],
      ]),
    },
    loading: false,
    error: null,
    getBoard: mockGetBoard,
    moveTask: mockMoveTask,
  }),
}))

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: (provided: any) => React.ReactNode }) =>
    children({
      droppableProps: {},
      innerRef: jest.fn(),
      placeholder: null,
    }),
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
      },
      { isDragging: false }
    ),
}))

describe('KanbanBoard', () => {
  beforeEach(() => {
    mockGetBoard.mockClear()
    mockMoveTask.mockClear()
  })

  it('renders board with columns', () => {
    render(<KanbanBoard />)
    
    expect(screen.getByText('Project Board')).toBeInTheDocument()
    expect(screen.getByText('Manage your tasks across different industries with drag and drop')).toBeInTheDocument()
    
    // Check all columns are rendered
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays tasks in correct columns', () => {
    render(<KanbanBoard />)
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
  })

  it('calls getBoard on mount', () => {
    render(<KanbanBoard />)
    
    expect(mockGetBoard).toHaveBeenCalledTimes(1)
  })

  it('shows add task button', () => {
    render(<KanbanBoard />)
    
    const addButton = screen.getByText('Add Task')
    expect(addButton).toBeInTheDocument()
  })

  it('renders loading state', () => {
    // Mock loading state
    jest.doMock('@/store/boardStore', () => ({
      useBoardStore: () => ({
        board: { columns: new Map() },
        loading: true,
        error: null,
        getBoard: mockGetBoard,
        moveTask: mockMoveTask,
      }),
    }))

    render(<KanbanBoard />)
    
    // Should show loading skeleton
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders error state', () => {
    // Mock error state
    jest.doMock('@/store/boardStore', () => ({
      useBoardStore: () => ({
        board: { columns: new Map() },
        loading: false,
        error: 'Failed to fetch tasks',
        getBoard: mockGetBoard,
        moveTask: mockMoveTask,
      }),
    }))

    render(<KanbanBoard />)
    
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument()
  })
})