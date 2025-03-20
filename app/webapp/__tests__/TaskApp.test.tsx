// __tests__/TaskApp.test.tsx
import { render, screen } from '@testing-library/react';
import TaskApp from '../page';
import '@testing-library/jest-dom';

// Mock Supabase client
jest.mock('../../../utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        order: jest.fn().mockImplementation(() => ({
          then: jest.fn().mockImplementation(() => ({ data: [] }))
        }))
      })),
    })),
    auth: {
      getUser: jest.fn().mockImplementation(() => ({
        data: {
          user: {
            id: 'test-user-id',
            user_metadata: {
              full_name: 'Test User',
              email: 'test@example.com',
              picture: 'https://example.com/picture.jpg'
            },
          },
        },
        error: null,
      })),
    },
  })),
}));

describe('TaskApp', () => {
  it('renders user profile information', async () => {
    render(await TaskApp());
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders navigation items', async () => {
    render(await TaskApp());
    // Use more specific queries
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument(); // For the h1 element
     expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });
});
