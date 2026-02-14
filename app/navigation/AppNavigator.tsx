import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NewPackageScreen from '../screens/NewPackageScreen';
import MapScreen from '../screens/MapScreen';
import DriverScreen from '../screens/DriverScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NewPackage: undefined;
  MapScreen: { packageId: string } | undefined;
  Driver: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="NewPackage"
          component={NewPackageScreen}
          options={{ title: 'New Package' }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ title: 'Track Package' }}
        />
        <Stack.Screen
          name="Driver"
          component={DriverScreen}
          options={{ title: 'Driver Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
