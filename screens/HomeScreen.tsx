import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import Footer from '../components/Footer';
import Moodify from '../components/Moodify';
import Welcome from '../components/Welcome';
import ReadyToTuneIn from '../components/ReadyToTuneIn';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Moodify />
          <Welcome />
          <ReadyToTuneIn />
        </ScrollView>
        <Footer />
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

export default HomeScreen;
