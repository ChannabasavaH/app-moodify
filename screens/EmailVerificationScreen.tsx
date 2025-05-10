import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios/index';
import Navbar from '../components/Navbar';

const EmailVerificationScreen = ({route}: any) => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const {username} = route.params;

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit OTP sent to your email.',
      );
      return;
    }
    try {
      await axios.post('http://192.168.214.86:8080/api/users/verify', {
        username,
        code: otp,
      });
      navigation.navigate('Login');
      Alert.alert('Success', 'OTP verified!');
    } catch (err) {
      Alert.alert('Error', 'Invalid or expired OTP');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Hello {username}!</Text>
          <Text style={styles.text}>Input your OTP</Text>
          <OTPTextInput
            inputCount={6}
            handleTextChange={otp => setOtp(otp)}
            tintColor="#000"
            offTintColor="#bbb"
            containerStyle={{marginTop: 20}}
            textInputStyle={{
              borderBottomWidth: 2,
              borderColor: '#000',
            }}
          />
          <TouchableOpacity onPress={handleVerify} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  title: {
    fontSize: 30,
    color: '#000',
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
  button: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default EmailVerificationScreen;
