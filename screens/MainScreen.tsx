import React from 'react';
import { SafeAreaView, View, ScrollView, StyleSheet } from 'react-native';
import Main from '../components/Main';
import Navbar from '../components/Navbar';

const MainScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Navbar />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Main />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default MainScreen;