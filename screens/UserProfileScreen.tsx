import React from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import Navbar from '../components/Navbar';

const UserProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Navbar />
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Text>User Profile</Text>
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
        width: "100%",
        height: "100%",
    }, 
    scrollview: {
        flexGrow: 1,
    },
})

export default UserProfileScreen;
