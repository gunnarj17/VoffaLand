import React from 'react';
// hjálpar með að fara til baka á seinasta skjá
import { NavigationContainer } from '@react-navigation/native';
// hjálpar til með að stacka screens ofaná hvort annað þegar verið er að navigate-a á milli skjáa
import { createStackNavigator } from '@react-navigation/stack';

import Home from './src/screens/Home';
import Parks from './src/screens/Parks';

// this gives us the capability of using all the firebase methods in our application
import * as firebase from 'firebase';

//initialize firebase storing all the information regarding our firebase application
const firebaseConfig = {
  apiKey: "AIzaSyDtvmX8T-1N5OBBXVij228d0QtWkuORYpg",
  authDomain: "voffaland-2db0c.firebaseapp.com",
  databaseURL: "https://voffaland-2db0c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "voffaland-2db0c",
  storageBucket: "voffaland-2db0c.appspot.com",
};

// run the firebase initialize app with the firebase config then we can run the firebase functions that are
// available in the SDK
firebase.initializeApp(firebaseConfig);

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


