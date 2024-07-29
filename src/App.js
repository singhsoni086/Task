import React, {useState,useEffect} from 'react';

const App =()=>{
const [rewtransactions,setRewtransactions] = useState([]);
const [points, setPoints] = useState([]);

useEffect(()=>{

    // The useeffect hooks Simulating an API CALL to fetch transation data and update the state accoudingly.
     const fetchTransactions = async()=>{
      const data =[
        { customerId:1 , amounts: 150, date: '2024-07-25'},
        { customerId:2 , amounts: 130, date: '2024-07-24'},
        { customerId:3 , amounts: 110, date: '2024-07-23'},
        { customerId:4 , amounts: 90, date: '2024-07-22'},
        { customerId:5 , amounts: 70, date: '2024-07-21'},
        { customerId:6 , amounts: 50, date: '2024-07-20'},
    ];
    setRewtransactions(data);
    };


    fetchTransactions();
},[]);

useEffect(()=>{

const rewcalculatePoints = (rewtransactions)=> 
    {
return rewtransactions.map((transaction)=>{
        let points = 0;
        if(transaction.amounts > 100)
        {
            points = (transaction.amounts - 100) * 2 + 50;
        }
        else if(transaction.amounts > 50)
        {
            points = (transaction.amounts -50);
        }
        return{
            customerId: transaction.customerId,
            date: transaction.date,
            points
        };
      
});
};

const rewPointsData = rewcalculatePoints(rewtransactions);
setPoints(rewPointsData);
}, [rewtransactions]);

// This react component fetches transaction data, calculate the rewards points and display them using retun methods.

return(
    <div>
        <h1> View Rewards Points</h1>
        <ul>{points && points.map((entry, index)=> (
              <li key={index}> customers
                  {entry.customerId} earned 
                  {entry.points} points on
                  {entry.date}
              </li>
            ))}
        </ul>
    </div>
);
};

export default App;