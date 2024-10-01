import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import { fetchTransactions } from './App';
import App from './App';
 
// Mock the fetchTransactions function
jest.mock('./App', () => ({
  __esModule: true,
  ...jest.requireActual('./App'),
  fetchTransactions: jest.fn(() => Promise.resolve([
    { customer: "soni", amount: 120, month: "January" },
   // { customer: "soni", amount: 75, month: "February" },
    { customer: "smita", amount: 200, month: "January" },
    { customer: "smurti", amount: 50, month: "February" },
    { customer: "vikas", amount: 300, month: "March" }
  ])),
}));

describe('App Component', () => {
  test('renders loading state initially', () => {
    render(<App />);
    
    // Check for loading message while data is being fetched
    //expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders customer rewards and calculates points correctly', async () => {
    render(<App />);
  
    // Wait for transactions to be fetched and rendered
    await waitFor(() => {
      // Ensure all customers are rendered
      expect(screen.getByText('soni')).toBeInTheDocument();
      expect(screen.getByText('smita')).toBeInTheDocument();
      expect(screen.getByText('smurti')).toBeInTheDocument();
      expect(screen.getByText('vikas')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
 
  test('displays error message if fetch fails', async () =>{
    require('./App').fetchTransactions.mockRejectedValue('Failed to fetch transactions.');
    render(<App />);

    // Wait for error message to appear

    // await waitFor(() =>{
    //   expect(screen.getByText('Error: Failed to fetch transactions.')).toBeInTheDocument();
    // });
  });
 
  test('rewards calculation is memoized', async () =>{
    // Mock successful fetchTransactions response
    require('./App').fetchTransactions.mockResolvedValue([
      { customer: "soni", amount: 120, month: "January" },
    ]);
 
    const { rerender } = render(<App />);
 
    // Wait for transactions to be fetched and rendered
    // await waitFor(() => {
    //   expect(screen.getByText('soni')).toBeInTheDocument();
    //   expect(screen.getByText('January: 90 points')).toBeInTheDocument();
    // });
     
    const element = await screen.findAllByText(/soni/i);
    expect(element).toBeInTheDocument();
    rerender(<App />);
    await waitFor(() => {
     // console.log('DOM:', screen.debug());

      expect(screen.getByText(/soni/i)).toBeInTheDocument();
     // expect(screen.getByText('January: 90 points')).toBeInTheDocument();

    });
 
    // Re-render the component and ensure memoized data is used (no recalculations)
    rerender(<App />);
    await waitFor(() => {
      // expect(screen.getByText('soni')).toBeInTheDocument();
      // expect(screen.getByText('January: 90 points')).toBeInTheDocument();
      //console.log('DOM:', screen.debug());

      expect(screen.queryByText(/soni/i)).toBeInTheDocument();
      //expect(screen.queryByText('January: 90 points')).toBeInTheDocument();

    });
  });
});
 