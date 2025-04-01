import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Welcome = () => {
  return (
    <View style={styles.container}>
      <View style={styles.component}>
        <Text style={styles.title}>Welcome to Moodify</Text>
        <Text style={styles.description}>
          Where the mood of your face chooses the music taste. Let’s venture
          into the world of rhythm and emotion where your facial sentiment
          curates a unique playlist for you.
        </Text>
      </View>
      <View style={styles.component}>
        <Text style={styles.title}>How it works?</Text>
        <Text style={styles.description}>
          We scan your face. We get the mood. We pick the tunes. That’s it, just
          hit the ‘Generate’ button and make your day melodious with Moodify.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  component: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Jua-Regular',
    color: '#000',
    paddingBottom: 6,
  },
  description: {
    fontSize: 20,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#30362F',
    textAlign: 'center',
    marginHorizontal: 10,
    lineHeight: 25,
  },
});

export default Welcome;
