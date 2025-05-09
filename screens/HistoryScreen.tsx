import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HistoryScreen = () => {
    return(
        <View style={styles.container}>
            <Text>History Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
  },
});

export default HistoryScreen;