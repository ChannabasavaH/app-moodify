import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import Moodify from '../components/Moodify';
import Navbar from '../components/Navbar';
import {AuthContext} from '../context/authContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const {token} = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      navigation.navigate('MainTabs');
    }
  }, [token, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Navbar />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Moodify />
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
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default HomeScreen;
