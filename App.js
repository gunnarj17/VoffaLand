import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import { Ionicons } from '@expo/vector-icons';

// stack screens
import WelcomeScreen from './screens/WelcomeScreen';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import LoadingScreen from './screens/LoadingScreen';


// Tab Screens
import Info from './screens/InfoScreen';
import Profile from './screens/ProfileScreen';
import Parks from './screens/ParksScreen';
import Events from './screens/EventsScreen';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Sign Up' component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name='Sign In' component={SignIn} options={{ headerShown: false }} />

        <Stack.Screen name={'Parks'} options={{ headerShown: false }}>{() => (
          <Tab.Navigator
            initialRouteName='Parks'
            activeColor='#FFFFFF'
            inactiveColor='#F2F9F4'
            
            barStyle={{
              overflow: 'hidden',
              backgroundColor: '#034B42',
              // borderRadius: 30,
            }}
          >
            <Tab.Screen name='Staðsetningar' component={Parks} options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="location-sharp"
                  size={22}
                  color={focused ? 'white' : 'gray'}
                />
              )
            }} />

            <Tab.Screen name='Upplýsingar' component={Info} options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="information-circle"
                  size={23}
                  color={focused ? 'white' : 'gray'}
                />
              )
            }} />

            <Tab.Screen name='Viðburðir' component={Events} options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="calendar"
                  size={22}
                  color={focused ? 'white' : 'gray'}
                />
              )
            }} />

            <Tab.Screen name='Prófíll' component={Profile} options={{
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name="person"
                  size={22}
                  color={focused ? 'white' : 'gray'}
                />
              )
            }} />
          </Tab.Navigator>)}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}