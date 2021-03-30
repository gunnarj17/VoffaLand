import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Parks from '../screens/Parks';
import Events from '../screens/Events';

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator 
    initialRouteName="Parks">
      <Tab.Screen
        name='Parks'
        component={Parks}
        initialParams={{ icon: 'home' }}
      />
      <Tab.Screen
        name='Events'
        component={Events}
        initialParams={{ icon: 'plus' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;