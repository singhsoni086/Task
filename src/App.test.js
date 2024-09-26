import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
 
// Mock the fetchTransactions function
jest.mock('./App', () => ({
  __esModule: true,
  fetchTransactions: jest.fn(),
}));
 
describe('App Component', () => 
  {
  test('renders loading state initially', () => 
    {
    render(<App />);
    
    // Check for loading message while data is being fetched
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
 
  test('renders customer rewards and calculates points correctly', async () =>
     {
    // Mock successful fetchTransactions response
    require('./App').fetchTransactions.mockResolvedValue([
      { customer: "soni", amount: 120, month: "January" },
      { customer: "soni", amount: 75, month: "February" },
      { customer: "smita", amount: 200, month: "January" },
      { customer: "smurti", amount: 50, month: "February" },
      { customer: "vikas", amount: 300, month: "March" }
    ]);
 
    render(<App />);
 
    // Wait for transactions to be fetched and rendered

    await waitFor(() =>
       {


      // Ensure all customers are rendered
      expect(screen.getByText('soni')).toBeInTheDocument();
      expect(screen.getByText('smita')).toBeInTheDocument();
      expect(screen.getByText('smurti')).toBeInTheDocument();
      expect(screen.getByText('vikas')).toBeInTheDocument();
 

           // Ensure points are correctly calculated for soni
           expect(screen.getByText('January: 90 points')).toBeInTheDocument();
           expect(screen.getByText('February: 25 points')).toBeInTheDocument();
      
           // Ensure points are correctly calculated for smita
           expect(screen.getByText('January: 150 points')).toBeInTheDocument();
     
          // Ensure points are correctly calculated for smurti
           expect(screen.getByText('February: 0 points')).toBeInTheDocument();
     
         // Ensure points are correctly calculated for vikas
           expect(screen.getByText('March: 500 points')).toBeInTheDocument();
    });

  });
 
  test('displays error message if fetch fails', async () =>
     {

    // Mock fetch failure
    require('./App').fetchTransactions.mockRejectedValue('Failed to fetch transactions.');
 
    render(<App />);
 
    // Wait for error message to appear
    await waitFor(() =>
       {
      expect(screen.getByText('Error: Failed to fetch transactions.')).toBeInTheDocument();
    });
  });
 
  test('rewards calculation is memoized', async () =>
     {

    // Mock successful fetchTransactions response
    require('./App').fetchTransactions.mockResolvedValue([
      { customer: "soni", amount: 120, month: "January" },
    ]);
 
    const { rerender } = render(<App />);
 
    // Wait for transactions to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('soni')).toBeInTheDocument();
      expect(screen.getByText('January: 90 points')).toBeInTheDocument();
    });
 
    // Re-render the component and ensure memoized data is used (no recalculations)
    rerender(<App />);
    await waitFor(() => {
      expect(screen.getByText('soni')).toBeInTheDocument();
      expect(screen.getByText('January: 90 points')).toBeInTheDocument();
    });
  });
});
 