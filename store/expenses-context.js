import { createContext, useReducer, useEffect } from "react";
import {
  storeExpense,
  fetchExpenses,
  updateExpense as updateExpenseHttp,
  deleteExpense as deleteExpenseHttp, // <-- Renamed imported function
} from "../util/http";

export const ExpensesContext = createContext({
  uid: null,
  expenses: [],
  addExpense: ({ description, ammount, date }) => {},
  setExpenses: (expenses) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, ammount, date }) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      return state.map((expense) =>
        expense.id === action.payload.id
          ? { ...expense, ...action.payload.data }
          : expense
      );
    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpensesContextProvider({ children, uid }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  useEffect(() => {
    if (uid) {
      fetchExpenses(uid).then(setExpenses);
    }
  }, [uid]);

  function addExpense(expenseData) {
    if (uid) {
      storeExpense(uid, expenseData).then((id) => {
        dispatch({ type: "ADD", payload: { ...expenseData, id: id } });
      });
    }
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    if (uid) {
      deleteExpenseHttp(uid, id).then(() => {
        dispatch({ type: "DELETE", payload: id });
      });
    }
  }

  async function updateExpense(uid, id, expenseData) {
    if (uid) {
      try {
        await updateExpenseHttp(uid, id, expenseData);
        return dispatch({
          type: "UPDATE",
          payload: { id: id, data: expenseData },
        });
      } catch (error) {
        throw error;
      }
    }
  }

  const value = {
    uid: uid,
    expenses: expensesState,
    setExpenses: setExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
