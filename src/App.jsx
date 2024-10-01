import React, { useState, useEffect, useMemo } from "react";
 
// Mock API to simulate fetching data
const fetchTransactions = () =>{
 return new Promise((resolve, reject) =>{
   setTimeout(() =>{
     const success = true; // Simulating API success/failure
     if (success){
       resolve([
         { customer: "soni", amount: 120, month: "January" },
        // { customer: "soni", amount: 75, month: "February" },
         { customer: "smita", amount: 200, month: "January" },
         { customer: "smurti", amount: 50, month: "February" },
         { customer: "vikas", amount: 300, month: "March" }
       ]);
     } else{
       reject("Failed to fetch transactions.");
     }
   }, 1000);
 });
};
export { fetchTransactions };
const calculatePoints = (amount) => {
  if (amount > 100) {
    return (amount - 100) * 2 + 50; // 2 points for every dollar over 100, plus 1 point for every dollar between 50 and 100
  } else if (amount > 50) {
    return amount - 50; // 1 point for every dollar between 50 and 100
  } else {
    return 0; // No points for amounts less than 50
  }
};
 
const App = () =>{
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
 
  useEffect(() =>{
    fetchTransactions()
      .then((data) => {
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
      })
      .catch((err) => {
        setError(err); 
        // based on requirments i am added Handle error here
        // Used catch block to handle errors i the fetchTransactions promise and set an errors state.
        // Display an errors msg if somthing goes wrong during data fetching.
      })
      .finally(() => {
        setLoading(false); 
        // Always remove loading state
        // Ones the data is fetched the loading state is turned off.
      });
  }, []);
 

  //Memorization and loading default state added by REACT.memo to optimize the performance, especially 
  //for function or components that do not need to be recalculated on every render.
  

  const memoizedRewards = useMemo(() => rewards, [rewards]); 
 
  if (loading) {
    return <div>Loading...</div>;
    //console.log('loading')
  }
 
  if (error) {
    return <div>Error: {error}</div>;
   // console.log('error', error)
  }
 
  return (
    <div>
      <h1>Customer Rewards</h1>
      {Object.keys(memoizedRewards).map((customer) => (
        <div key={customer} className="customer-block">
          <h2>{customer}</h2>
          {Object.keys(memoizedRewards[customer]).map((month) => (
            <p key={month}>
              {month}: <span>{memoizedRewards[customer][month]} points</span>
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};
 
export default React.memo(App);
 