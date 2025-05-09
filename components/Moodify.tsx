import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import heroImage from '../assets/images/home-hero-image.jpg';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';

const Moodify = () => {

  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  const handlePage = () => {
    if(!token){
      navigation.navigate("SignUp")
    } else {
      navigation.navigate("Main");
    }
  }

  return (
    <ImageBackground source={heroImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Text style={styles.text}>Moodify</Text>
        <Text style={styles.para}>
          Your mood, your music. Discover songs that match exactly how you feel.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handlePage}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20
  },
  text: {
    fontSize: 60,
    color: '#fffbdb',
    fontFamily: 'Jua-Regular',
  },
  para: {
    textAlign: "center",
    fontSize: 20,
    color: '#fffbdb',
    fontFamily: 'LibreBaskerville-Regular',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: "600"
  },
});

export default Moodify;
