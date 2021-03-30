import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// SignedOut layout:
import Home from "../screens/Home";
import Login from '../screens/Login';
import Register from "../screens/Register";
// SignedIn layout:
import Parks from '../screens/Parks';
import Events from '../screens/Events';

// SignedOut Navigation:
const Stack = createStackNavigator();
export const SignedOut = StackNavigator({

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
});

// SignedIn Navigation:
const Tab = createBottomTabNavigator();
export const SignedIn = TabNavigator({
    Parks: {
        screen: Parks,
        navigationOptions: {
            tabBarLabel: "Hundasvæði",
            tabBarIcon: ({tintColor}) => (
                <FontAwesome name="home" size={30} color={tintColor} />
            )
        }
    },
    Events: {
        screen: Events,
        navigationOptions: {
            tabBarLabel: "Viðburðir",
            tabBarIcon: ({tintColor}) => (
                <FontAwesome name="calander" size={30} color={tintColor} />
            ) 
        }
    }
});