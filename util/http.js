import { app, auth } from "../firebase";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { BACKEND_URL } from "@env";

export async function storeExpense(uid, expenseData) {
  const idToken = await auth.currentUser.getIdToken();

  try {
    const response = await axios.post(
      `${BACKEND_URL}/expenses/${uid}.json?auth=${idToken}`,
      expenseData
    );
    const id = response.data.name;
    return id;
  } catch (error) {
    throw error;
  }
}

export async function fetchExpenses(uid) {
  try {
    const response = await axios.get(`${BACKEND_URL}/expenses/${uid}.json`);
    const expenses = [];

    for (const key in response.data) {
      const expenseObj = {
        id: key,
        amount: response.data[key].amount,
        date: new Date(response.data[key].date),
        description: response.data[key].description,
      };
      expenses.push(expenseObj);
    }
    return expenses;
  } catch (error) {
    throw error;
  }
}

export function updateExpense(uid, id, expenseData) {
  if (auth.currentUser === null) {
    return Promise.reject(new Error("User is not authenticated"));
  }

  return auth.currentUser
    .getIdToken()
    .then((idToken) => {
      return axios
        .put(
          `${BACKEND_URL}/expenses/${uid}/${id}.json?auth=${idToken}`,
          expenseData
        )
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
          }

          return response.data; // Return the response data
        })
        .catch((error) => {
          throw error;
        });
    })
    .catch((error) => {
      throw error;
    });
}
export function deleteExpense(uid, id) {
  return auth.currentUser.getIdToken().then((idToken) => {
    return axios
      .delete(`${BACKEND_URL}/expenses/${uid}/${id}.json?auth=${idToken}`)
      .catch((error) => {
        throw error;
      });
  });
}
