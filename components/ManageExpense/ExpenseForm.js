import { View } from "react-native";
import Input from "./Input";

function ExpenseForm() {
  function ammountChangedHandler() {}

  return (
    <View>
      <Input
        label="Ammount"
        textInputConfig={{
          keyboardType: "decimal-pad",
          onChangeText: ammountChangedHandler,
        }}
      />
      <Input
        label="Date"
        textInputConfig={{
          placeholder: "YYYY-MM-DD",
          maxLength: 10,
          onChangeText: () => {},
        }}
      />
      <Input
        label="Description"
        textInputConfig={{
          multiline: true,
          // autoCapitalize: "none"
          // autoCorrect: true, default is true
        }}
      />
    </View>
  );
}

export default ExpenseForm;
