import React from 'react';
// hjálpar með að fara til baka á seinasta skjá
import { NavigationContainer } from '@react-navigation/native';
// hjálpar til með að stacka screens ofaná hvort annað þegar verið er að navigate-a á milli skjáa
import { createStackNavigator } from '@react-navigation/stack';

import Home from './src/screens/Home';
import Parks from './src/screens/Parks';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Innskráning" component={Home} />
        <Stack.Screen
          options={{ headerLargeTitle: true }}
          name="Hundasvæði" component={Parks} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


