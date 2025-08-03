import { renderHook, act } from '@testing-library/react'
import { useBoardStore } from '@/store/boardStore'

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('boardStore', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Reset store state
    act(() => {
      useBoardStore.setState({
        board: {
          columns: new Map([
            ['TODO', { id: 'TODO', tasks: [] }],
            ['IN_PROGRESS', { id: 'IN_PROGRESS', tasks: [] }],
            ['REVIEW', { id: 'REVIEW', tasks: [] }],
            ['DONE', { id: 'DONE', tasks: [] }],
          ]),
        },
        loading: false,
        error: null,
      })
    })
  })

  it('initializes with empty columns', () => {
    const { result } = renderHook(() => useBoardStore())
    
    expect(result.current.board.columns.size).toBe(4)
    expect(result.current.board.columns.get('TODO')?.tasks).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('fetches board data successfully', async () => {
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Test Task',
        status: 'TODO',
        priority: 'HIGH',
        assignee: { id: '1', name: 'John Doe' },
        project: { id: '1', title: 'Test Project' },
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    } as Response)

    const { result } = renderHook(() => useBoardStore())

    await act(async () => {
      await result.current.getBoard()
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/tasks')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('handles fetch errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useBoardStore())

    await act(async () => {
      await result.current.getBoard()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Failed to fetch tasks')
  })

  it('moves task between columns', async () => {
    const mockTask = {
      id: 'task-1',
      title: 'Test Task',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      assignee: { id: '1', name: 'John Doe' },
      project: { id: '1', title: 'Test Project' },
    }

    // Set up initial state with a task in TODO
    act(() => {
      useBoardStore.setState({
        board: {
          columns: new Map([
            ['TODO', { id: 'TODO', tasks: [mockTask] }],
            ['IN_PROGRESS', { id: 'IN_PROGRESS', tasks: [] }],
            ['REVIEW', { id: 'REVIEW', tasks: [] }],
            ['DONE', { id: 'DONE', tasks: [] }],
          ]),
        },
      })
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    const { result } = renderHook(() => useBoardStore())

    await act(async () => {
      await result.current.moveTask('task-1', 'TODO', 'IN_PROGRESS', 0)
    })

    // Check that task was moved
    const todoTasks = result.current.board.columns.get('TODO')?.tasks
    const inProgressTasks = result.current.board.columns.get('IN_PROGRESS')?.tasks

    expect(todoTasks).toHaveLength(0)
    expect(inProgressTasks).toHaveLength(1)
    expect(inProgressTasks?.[0].status).toBe('IN_PROGRESS')

    // Check that API was called
    expect(mockFetch).toHaveBeenCalledWith('/api/tasks/task-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'IN_PROGRESS' }),
    })
  })

  it('adds task to column', async () => {
    const mockTask = {
      id: 'new-task',
      title: 'New Task',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      assignee: null,
      project: { id: '1', title: 'Test Project' },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    } as Response)

    const { result } = renderHook(() => useBoardStore())

    await act(async () => {
      await result.current.addTask(mockTask, 'TODO')
    })

    const todoTasks = result.current.board.columns.get('TODO')?.tasks
    expect(todoTasks).toHaveLength(1)
    expect(todoTasks?.[0].title).toBe('New Task')

    expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Task',
        description: undefined,
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        projectId: '1',
        assignedTo: null,
      }),
    })
  })

  it('deletes task from column', async () => {
    const mockTask = {
      id: 'task-to-delete',
      title: 'Task to Delete',
      status: 'TODO' as const,
      priority: 'LOW' as const,
      assignee: null,
      project: { id: '1', title: 'Test Project' },
    }

    // Set up initial state with a task
    act(() => {
      useBoardStore.setState({
        board: {
          columns: new Map([
            ['TODO', { id: 'TODO', tasks: [mockTask] }],
            ['IN_PROGRESS', { id: 'IN_PROGRESS', tasks: [] }],
            ['REVIEW', { id: 'REVIEW', tasks: [] }],
            ['DONE', { id: 'DONE', tasks: [] }],
          ]),
        },
      })
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    const { result } = renderHook(() => useBoardStore())

    await act(async () => {
      await result.current.deleteTask('task-to-delete', 'TODO')
    })

    const todoTasks = result.current.board.columns.get('TODO')?.tasks
    expect(todoTasks).toHaveLength(0)

    expect(mockFetch).toHaveBeenCalledWith('/api/tasks/task-to-delete', {
      method: 'DELETE',
    })
  })
})