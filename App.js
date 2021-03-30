import React from 'react';
// hjálpar með að fara til baka á seinasta skjá
import { NavigationContainer } from '@react-navigation/native';
// hjálpar til með að stacka screens ofaná hvort annað þegar verið er að navigate-a á milli skjáa
import { createStackNavigator } from '@react-navigation/stack';
// Bottom tab navigator

// import AuthNavigator from './src/navigation/AuthNavigator';


// export default class App extends React.Component {
//   render() {
//     return <AuthNavigator />;
//   }
// }



import Home from './src/screens/Home';
import Parks from './src/screens/Parks';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import TabNavigator from './src/navigation/TabNavigator';

function BottomTabNavigator(){
  <NavigationContainer>
    <TabNavigator/>
  </NavigationContainer>
}

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

  );
}