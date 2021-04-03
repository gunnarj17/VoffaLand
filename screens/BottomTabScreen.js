
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'native-base';

import Dashboard from './Dashboard';
import Profile from './ProfileScreen';
import Parks from './ParksScreen';

// const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();


const BottomTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Dashboard"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Parks"
        component={Parks}
        options={{
          tabBarLabel: 'Parks',
          tabBarIcon: ({ color }) => (
            <Icon name="bell" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);

export default BottomTabScreen;

// export default function HomeStackScreen({ navigation }) {
//     if (!firebase.apps.length) {
//       console.log('Connected with Firebase')
//       firebase.initializeApp(apiKeys.firebaseConfig);
//     }
  
//     return (
//       <NavigationContainer>
//         <Stack.Navigator>
//         <Stack.Screen name={'Dashboard'} component={Dashboard} options={{ headerShown: false }} />
//         <Stack.Screen name={'Profile'} component={Profile} options={{ headerShown: false }}/>
//         <Stack.Screen name={'Parks'} component={Parks} options={{ headerShown: false }}/>
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }