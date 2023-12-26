import axios from "axios";

export function storeExpense(expenseData) {
  axios.post(
    "https://expense-tracker-6108d-default-rtdb.europe-west1.firebasedatabase.app/expenses.json",
    expenseData
  );
}
