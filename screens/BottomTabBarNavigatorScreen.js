import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Tab Screens
import Info from './InfoScreen';
import Profile from './ProfileScreen';
import Parks from './ParksScreen';
import Events from './EventsScreen';
import TabBar from './TabBar';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (

        <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
            <Tab.Screen name='Staðsetningar' component={Parks} />
            <Tab.Screen name='Upplýsingar' component={Info} />
            <Tab.Screen name='Viðburðir' component={Events} />
            <Tab.Screen name='Prófíll' component={Profile} />
        </Tab.Navigator>

    );
};

export default TabNavigator;
