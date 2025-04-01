import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';

const ReadyToTuneIn = () => {

    const handleGenerate = () => {
        console.log("Generate Button Pressed!");
      };

  return (
    <View style={styles.container}>
      <Icon name="music" size={40} color={'#000'} />
      <Text style={styles.title}>Ready To Tune In?</Text>
      <Text style={styles.description}>
        Just a click separates you from your personalised playlist. Hit
        ‘Generate’ or ‘Explore’ to dive in the ocean of music tailored for your
        current mood.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Let's Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#fff',
      paddingVertical: 40,
    },
    icon: {
      marginBottom: 20,
    },
    title: {
      fontSize: 30,
      fontFamily: 'Jua-Regular',
      color: '#000',
      margin: 10,
    },
    description: {
      fontSize: 18,
      fontFamily: 'LibreBaskerville-Regular',
      color: '#000',
      textAlign: 'center',
      marginHorizontal: 10,
      lineHeight: 25,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
      },
  });

export default ReadyToTuneIn;
