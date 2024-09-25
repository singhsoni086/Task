import React, { useState, useEffect } from "react";
 
// Mock API to simulate fetching data

const fetchTransactions = () =>
     {
      //use promise
  return new Promise((resolve) => 
    {

    setTimeout(() => 
        {
      resolve([
        { customer: "soni", amount: 120, month: "January" },
        { customer: "soni", amount: 75, month: "February" },
        { customer: "smita", amount: 200, month: "January" },
        { customer: "smita", amount: 50, month: "February" },
        { customer: "smita", amount: 300, month: "March" },
      ]);
    }, 1000);
  });
};
 
const calculatePoints = (amount) => {
  if (amount > 100) {
    return (amount - 100) * 2 + 50; // 2 points for every dollar over 100, plus 1 point for every dollar between 50 and 100
  } else if (amount > 50) {
    return amount - 50; // 1 point for every dollar between 50 and 100
  } else {
    return 0; // No points for amounts less than 50
  }
};
 
const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({});
 
  useEffect(() => {
    fetchTransactions().then((data) => {
      setTransactions(data);
 
      // Calculate rewards
      const customerRewards = {};
 
      data.forEach((transaction) => {
        const { customer, amount, month } = transaction;
        const points = calculatePoints(amount);
 
        if (!customerRewards[customer]) {
          customerRewards[customer] = {};
        }
 
        if (!customerRewards[customer][month]) {
          customerRewards[customer][month] = 0;
        }
 
        customerRewards[customer][month] += points;
      });
 
      setRewards(customerRewards);
    });
  }, []);
 
  return (
    <div>
      <h1>Customer Rewards</h1>
      {Object.keys(rewards).map((customer) => (
        <div key={customer}>
          <h2>{customer}</h2>
          {Object.keys(rewards[customer]).map((month) => (
            <p key={month}>
              {month}: {rewards[customer][month]} points
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};
 
export default App;
 