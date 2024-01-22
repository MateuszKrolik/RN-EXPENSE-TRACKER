import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { fetchExpensesAsync } from "../redux/slice";

function AllExpenses() {
  const expenses = useSelector((state) => state.items);

  return (
    <ExpensesOutput
      expenses={expenses}
      expensesPeriod="Total"
      fallbackText="No registered expenses found"
    />
  );
}

export default AllExpenses;
