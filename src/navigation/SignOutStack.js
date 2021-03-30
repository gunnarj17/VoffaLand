import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


import Home from '../screens/Home'
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createStackNavigator()

export default function SignInStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Forsíða" component={Home} />
        <Stack.Screen name="Innskráning" component={Login} /> 
        <Stack.Screen name="Nýskráning" component={Register} /> 
      </Stack.Navigator>  
    </NavigationContainer>
  )
}
