import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from './dashboard';
import Marketplace from './marketplace';
import Orders from './orders';
import Wallet from './wallet';
import Profile from './profile';
import Chat from './chat';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                let name = 'home';
                if (route.name === 'Marketplace') name = 'cart';
                else if (route.name === 'Orders') name = 'receipt';
                else if (route.name === 'Wallet') name = 'wallet';
                else if (route.name === 'Profile') name = 'person';
                else if (route.name === 'Chat') name = 'chatbubbles';
                return <Ionicons name={name} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Marketplace" component={Marketplace} />
            <Tab.Screen name="Orders" component={Orders} />
            <Tab.Screen name="Wallet" component={Wallet} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Profile" component={Profile} />
          </Tab.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
