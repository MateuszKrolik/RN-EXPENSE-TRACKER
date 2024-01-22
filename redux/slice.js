import {
  createSlice,
  createAsyncThunk,
  createReducer,
  createAction,
} from "@reduxjs/toolkit";
import {
  storeExpense,
  fetchExpenses,
  updateExpense,
  deleteExpense,
} from "../util/http";

export const setLoading = createAction("expenses/setLoading");

export const fetchExpensesAsync = createAsyncThunk(
  "expenses/fetchExpenses",
  async (uid, thunkAPI) => {
    thunkAPI.dispatch(setLoading(true));
    try {
      if (!uid) {
        return thunkAPI.rejectWithValue();
      }
      const response = await fetchExpenses(uid);
      return response.map((expense) => ({
        ...expense,
        date: new Date(expense.date).toISOString(),
      }));
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);
export const addExpenseAsync = createAsyncThunk(
  "expenses/addExpense",
  async ({ uid, expenseData }, { getState }) => {
    const id = await storeExpense(uid, expenseData);
    return { ...expenseData, id: id };
  }
);

export const deleteExpenseAsync = createAsyncThunk(
  "expenses/deleteExpense",
  async ({ uid, id }, thunkAPI) => {
    try {
      await deleteExpense(uid, id); // changed from deleteExpenseHttp
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateExpenseAsync = createAsyncThunk(
  "expenses/updateExpense",
  async ({ uid, id, expenseData }, thunkAPI) => {
    try {
      await updateExpense(uid, id, expenseData); // changed from updateExpenseHttp
      return { id, data: expenseData };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = { items: [], loading: false };

const expensesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchExpensesAsync.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    })
    .addCase(addExpenseAsync.fulfilled, (state, action) => {
      state.items.unshift(action.payload); // add the new expense at the start
      state.loading = false;
    })
    .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (expense) => expense.id === action.payload
      );
      if (index !== -1) {
        state.items.splice(index, 1); // remove the expense
      }
      state.loading = false;
    })
    .addCase(updateExpenseAsync.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data }; // update the expense
      }
      state.loading = false;
    })
    .addCase(setLoading, (state, action) => {
      state.loading = action.payload;
    });
});
export default expensesReducer;
