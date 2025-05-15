import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import axios from 'axios/index';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Icon from '@react-native-vector-icons/fontawesome';

const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters long')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
});

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async values => {
      setLoading(true);
      try {
        await axios.post(
          'http://192.168.111.86:8080/api/users/signup',
          values,
          {withCredentials: true},
        );
        navigation.navigate('OTP', {username: values.username});
        Alert.alert('Success', 'Sign-up successful!');
      } catch (error: any) {
        console.error(
          'Error signing up:',
          error.response?.data ?? error.message,
        );
        Alert.alert('Error', 'Failed to sign up. Please try again.');
      }
      setLoading(false);
    },
  });

  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.box}>
            <Text style={styles.text}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={formik.handleChange('username')}
              value={formik.values.username}
              placeholderTextColor={'#000'}
            />
            {formik.errors.username && (
              <Text style={styles.errorText}>{formik.errors.username}</Text>
            )}

            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={formik.handleChange('email')}
              value={formik.values.email}
              keyboardType="email-address"
              placeholderTextColor={'#000'}
            />
            {formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}

            <Text style={styles.text}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
                placeholderTextColor="#000"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={handleShowPassword}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-slash'}
                  color="black"
                  size={20}
                />
              </TouchableOpacity>
            </View>
            {formik.errors.password && (
              <Text style={styles.errorText}>{formik.errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => formik.handleSubmit()}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontFamily: 'jua',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 10,
    color: 'black',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SignUpScreen;
