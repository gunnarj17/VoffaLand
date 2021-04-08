import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView, SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

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
const Tab = createBottomTabNavigator();

export default function App() {
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer >
        <Stack.Navigator
          tabBarOptions={{
            keyboardHidesTabBar: true,
            style: {
              position: 'absolute',
            },
          }}>
          <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Sign Up' component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name='Sign In' component={SignIn} options={{ headerShown: false }} />
          
          <Stack.Screen name={'Parks'} options={{ headerShown: false }} >{() => (
            <Tab.Navigator
              tabBarOptions={{
                style: {
                  backgroundColor: '#034B42',
                  borderRadius: 30,
                  width: 200,
                  height: 40,
                  bottom: 40,
                  alignSelf: 'center',
                },
                activeTintColor: '#FFFFFF',
                inactiveTintColor: '#F2F9F4',
                showLabel: false,
              }}>

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
    </SafeAreaProvider>
  );
}