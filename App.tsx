import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import AuthScreen from './app/screens/AuthScreen';
import DriverJobBoardScreen from './app/screens/DriverJobBoardScreen';
import DriverActiveJobScreen from './app/screens/DriverActiveJobScreen';
import NewPackageScreen from './app/screens/NewPackageScreen';
import MapScreen from './app/screens/MapScreen';
import ChatScreen from './app/screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsub;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="DriverJobBoardScreen" component={DriverJobBoardScreen} />
            <Stack.Screen name="DriverActiveJobScreen" component={DriverActiveJobScreen} />
            <Stack.Screen name="NewPackageScreen" component={NewPackageScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
