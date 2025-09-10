import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, PoiretOne_400Regular } from '@expo-google-fonts/poiret-one';
import 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    PoiretOne_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#6F4E6B', '#9C5C74']}
      style={styles.container}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
