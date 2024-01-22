import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { fetchExpensesAsync } from "../redux/slice";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const [recentExpenses, setRecentExpenses] = useState([]); // Define recentExpenses here
  const [timestamp, setTimestamp] = useState(Date.now()); // Add a timestamp state

  const expenses = useSelector((state) => state.items);
  const userId = useSelector((state) => state.userId);
  const dispatch = useDispatch(); // Add this line

  useEffect(() => {
    if (userId) {
      dispatch(fetchExpensesAsync(userId)); // Dispatch the action with the user ID
    }
  }, [userId, dispatch]); // Run when the component mounts and whenever userId changes

  useEffect(() => {
    if (expenses && expenses.length !== 0) {
      setIsFetching(false);
    }
  }, [expenses]);

  useEffect(() => {
    if (expenses) {
      // Check if expenses is not undefined
      const filteredExpenses = expenses.filter((expense) => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);
        const expenseDate = new Date(expense.date);
        return expenseDate >= date7DaysAgo && expenseDate <= today;
      });
      setRecentExpenses(filteredExpenses); // Set recentExpenses here
      setIsFetching(false);
    }
  }, [expenses, timestamp]); // Add timestamp to the dependency array

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText={"No expenses registered for the last 7 days"}
    />
  );
}

export default RecentExpenses;
