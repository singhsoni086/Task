import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
 
// Mock the fetchTransactions function
jest.mock('./App', () => ({
  __esModule: true,

  fetchTransactions: jest.fn(() =>
     {
    return Promise.resolve([
      { customer: "soni", amount: 120, month: "January" },
      { customer: "soni", amount: 75, month: "February" },
      { customer: "smita", amount: 200, month: "January" },
      { customer: "smurti", amount: 50, month: "February" },
      { customer: "vikas", amount: 300, month: "March" }
    ]);
  }),
}));
 
describe('App Component', () => {
  test('renders customer rewards and calculates points correctly', async () => {
    render(<App />);
 
    // Wait for transactions to be fetched and rendered
    await waitFor(() => {
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
 
  test('displays loading state while fetching transactions', () => {
    render(<App />);
    
    // Check for a loading message or spinner while data is being fetched
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
 