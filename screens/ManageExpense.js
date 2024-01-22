import { useLayoutEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { useSelector, useDispatch } from "react-redux";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import {
  deleteExpenseAsync,
  addExpenseAsync,
  updateExpenseAsync,
} from "../redux/slice";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { auth } from "../firebase";

function ManageExpense({ route, navigation }) {
  const expenses = useSelector((state) => state.items);
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  // Check if expenses is defined before calling find on it
  const selectedExpense = expenses
    ? expenses.find((expense) => expense.id === editedExpenseId)
    : null; // return null if expenses is undefined

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await dispatch(
        deleteExpenseAsync({ uid: auth.currentUser.uid, id: editedExpenseId })
      );
    } catch (error) {
      setError("Could not delete expense - please try again later!");
      setIsSubmitting(false);
    }
    navigation.goBack();
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    if (auth.currentUser === null) {
      return;
    }
    setIsSubmitting(true);
    try {
      const expenseDataSerializable = {
        ...expenseData,
        date: expenseData.date.toISOString(),
      };
      if (isEditing) {
        await dispatch(
          updateExpenseAsync({
            uid: auth.currentUser.uid,
            id: editedExpenseId,
            expenseData: expenseDataSerializable,
          })
        );
      } else {
        await dispatch(
          addExpenseAsync({
            uid: auth.currentUser.uid,
            expenseData: expenseDataSerializable,
          })
        );
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save data - please try again later!");
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={(expenseData) => {
          confirmHandler(expenseData);
        }}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
        isSubmitting={isSubmitting}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            size={36}
            color={GlobalStyles.colors.error500}
            onPress={() => {
              deleteExpenseHandler();
            }}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    padding: 8,
    borderWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
