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

import SelectedPark from './screens/SelectedPark';

// Tab Screens
import Info from './screens/InfoScreen';
import Profile from './screens/ProfileScreen';
import AddDogs from './screens/AddDogs';
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
        <Stack.Navigator>
          <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Sign Up' component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name='Sign In' component={SignIn} options={{ headerShown: false }} />
          <Stack.Screen name='addDogs' component={AddDogs} options={{ headerShown: false }} />
          <Stack.Screen name='Selected Park' component={SelectedPark} options={{ headerShown: false }} />


          <Stack.Screen name={'Parks'} options={{ headerShown: false }} >{() => (
            <Tab.Navigator
              tabBarOptions={{
                showLabel: false,
                // activeBackgroundColor: '#069380',
                tabStyle: {
                  // hægt að setja inn meiri styles
                  height: 40,
                },
                style: {
                  position: 'absolute',
                  backgroundColor: '#034B42',
                  borderRadius: 20,
                  left: "25%",
                  width: "50%",
                  height: 40,
                  bottom: 15
                },
              }}>

              <Tab.Screen name='Staðsetningar' component={Parks} options={({route}) => ({
                tabBarIcon: ({ focused }) => (
                  <Ionicons
                    name="location-sharp"
                    size={22}
                    color={focused ? 'white' : 'gray'}
                    name={focused ? 'location' : 'location-outline'}
                  />
                )
              })} />
              <Tab.Screen name='Upplýsingar' component={Info} options={{
                tabBarIcon: ({ focused }) => (
                  <Ionicons
                    name="information-circle"
                    size={23}
                    color={focused ? 'white' : 'gray'}
                    name={focused ? 'information-circle' : 'information-circle-outline'}
                  />
                )
              }} />

              <Tab.Screen name='Viðburðir' component={Events} options={{
                tabBarIcon: ({ focused }) => (
                  <Ionicons
                    name="calendar"
                    size={22}
                    color={focused ? 'white' : 'gray'}
                    name={focused ? 'calendar' : 'calendar-outline'}
                  />
                )
              }} />

              <Tab.Screen name='Prófíll' component={Profile} options={{
                tabBarIcon: ({ focused }) => (
                  <Ionicons
                    name="person"
                    size={22}
                    color={focused ? 'white' : 'gray'}
                    name={focused ? 'person' : 'person-outline'}
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