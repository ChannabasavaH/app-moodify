import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Moodify = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Moodify</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  text: {
    fontSize: 40,
    color: "#fffbdb",
    fontFamily: "Jua-Regular",
  },
});

export default Moodify;
