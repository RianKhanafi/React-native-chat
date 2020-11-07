import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text} from 'react-native';

import SignIn from './src/views/Register';
import SignUp from './src/views/Register/Signup';
import HomePage from './src/views/HomePage';
import ComplitedProfile from './src/views/Profile/ComplitedProfile';
import Room from './src/views/Chat/room';
import AddNewContact from './src/views/Contact/addNew';
import Contact from './src/views/Contact/index';
import {color} from './src/component/baseColor';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SignIn"
          component={SignIn}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="HomePage"
          component={HomePage}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ComplitedProfile"
          component={ComplitedProfile}
        />
        <Stack.Screen
          options={{
            headerShown: false,

            statusbar: {
              backgroundColor: color.green,
            },
          }}
          name="Room"
          component={Room}
        />

        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="AddNewContact"
          component={AddNewContact}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Contact"
          component={Contact}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
