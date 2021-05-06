// Input Box component
import React, { useState } from "react";
import {View, Text, StyleSheet,} from "react-native";
import {Input, Item, Label, Icon,} from "native-base";

export default InputBox = ({
  icon,
  label,
  isPassword,
  errorText,
  inputValue,
}) => {
  const [inputVal, setInputval] = useState("");

  const onChange = (value) => {
    setInputval(value);
    inputValue(value);
  };

  return (
    <View style={styles.EmailForm}>
      <Icon style={styles.Icons} name={icon} />
      <Item floatingLabel error={errorText.length > 0}>
        <Label style={styles.LabelText}>{label}</Label>
        <Input
          style={styles.InputBox}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={isPassword}
          value={inputVal}
          onChangeText={(val) => onChange(val)}
        />
      </Item>
     <Text>{errorText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  EmailForm: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Icons: {
    color: "#069380",
    marginTop: 40,
  },
  LabelText: {
    color: "#069380",
    fontSize: 20,
  },

  InputBox: {
    color: "#069380",
    width: "100%",
  },
});
