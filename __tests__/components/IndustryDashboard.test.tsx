import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IndustryDashboard from '@/components/IndustryDashboard'

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('IndustryDashboard', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders industry dashboard with default ALL industry', () => {
    render(<IndustryDashboard />)
    
    expect(screen.getByText('Project Management Dashboard')).toBeInTheDocument()
    expect(screen.getByText('All industries overview')).toBeInTheDocument()
  })

  it('renders IT industry dashboard', () => {
    render(<IndustryDashboard industry="IT" />)
    
    expect(screen.getByText('IT Agency Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Software development and technical projects')).toBeInTheDocument()
  })

  it('renders Construction industry dashboard', () => {
    render(<IndustryDashboard industry="CONSTRUCTION" />)
    
    expect(screen.getByText('Construction Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Building projects and site management')).toBeInTheDocument()
  })

  it('renders Interior Design industry dashboard', () => {
    render(<IndustryDashboard industry="INTERIOR_DESIGN" />)
    
    expect(screen.getByText('Interior Design Studio')).toBeInTheDocument()
    expect(screen.getByText('Creative projects and client spaces')).toBeInTheDocument()
  })

  it('displays industry-specific metrics', () => {
    render(<IndustryDashboard industry="IT" />)
    
    expect(screen.getByText('Sprint Velocity')).toBeInTheDocument()
    expect(screen.getByText('Code Reviews')).toBeInTheDocument()
    expect(screen.getByText('Deployments')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<IndustryDashboard />)
    
    // Should show loading skeleton initially
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays stats after loading', async () => {
    render(<IndustryDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Active Projects')).toBeInTheDocument()
      expect(screen.getByText('Tasks Completed')).toBeInTheDocument()
      expect(screen.getByText('Team Members')).toBeInTheDocument()
      expect(screen.getByText('Active Clients')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})