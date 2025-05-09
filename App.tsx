import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './context/authContext';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/fontawesome';

import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import HistoryScreen from './screens/HistoryScreen';
import {UserProvider} from './context/userContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Main') {
          iconName = 'home';
        } else if (route.name === 'Favorites') {
          iconName = 'heart';
        } else if (route.name === 'History') {
          iconName = 'history';
        } else if (route.name === 'User-Profile') {
          iconName = 'user';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen name="Main" component={MainScreen} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="User-Profile" component={UserProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="OTP" component={EmailVerificationScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
