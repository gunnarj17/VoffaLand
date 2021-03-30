import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import WelcomeScreen from './screens/WelcomeScreen';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import LoadingScreen from './screens/LoadingScreen';
import Dashboard from './screens/Dashboard';

const Stack = createStackNavigator();

export default function App() {
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Home' component={WelcomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Sign Up' component={SignUp} options={{ headerShown: false }}/>
      <Stack.Screen name='Sign In' component={SignIn} options={{ headerShown: false }}/>
      <Stack.Screen name={'Dashboard'} component={Dashboard} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
















// import React from 'react';
// // hjálpar með að fara til baka á seinasta skjá
// import { NavigationContainer } from '@react-navigation/native';
// // hjálpar til með að stacka screens ofaná hvort annað þegar verið er að navigate-a á milli skjáa
// import { createStackNavigator } from '@react-navigation/stack';

// import Home from './src/screens/Home';
// import Parks from './src/screens/Parks';
// import Login from './src/screens/Login';
// import Register from './src/screens/Register';

// import * as firebase from 'firebase';
// import {firebaseConfig} from './src/firebase/config';

// export default function App() {
//   const Stack = createStackNavigator();

//   return (

//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Forsíða" component={Home} />
//         <Stack.Screen
//           options={{ headerLargeTitle: true }}
//           name="Hundasvæði" component={Parks} />
//         <Stack.Screen name="Innskráning" component={Login} /> 
//         <Stack.Screen name="Nýskráning" component={Register} /> 
//       </Stack.Navigator>
//     </NavigationContainer>

//   );
// }