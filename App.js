import React from 'react';
// hjálpar með að fara til baka á seinasta skjá
import { NavigationContainer } from '@react-navigation/native';
// hjálpar til með að stacka screens ofaná hvort annað þegar verið er að navigate-a á milli skjáa
import { createStackNavigator } from '@react-navigation/stack';
// Navbar
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Home from './src/screens/Home';
import Parks from './src/screens/Parks';
import Login from './src/screens/Login';
import Register from './src/screens/Register';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Forsíða" component={Home} />
        <Stack.Screen
          options={{ headerLargeTitle: true }}
          name="Hundasvæði" component={Parks} />
        <Stack.Screen name="Innskráning" component={Login} /> 
        <Stack.Screen name="Nýskráning" component={Register} /> 
      </Stack.Navigator>
    </NavigationContainer>
//     <NavigationContainer>
// <Tab.Navigator>
//   <Tab.Screen name="Home" component={HomeScreen} />
//   <Tab.Screen name="Settings" component={SettingsScreen} />
// </Tab.Navigator>
// </NavigationContainer>

  );
}

// Navbar
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}


