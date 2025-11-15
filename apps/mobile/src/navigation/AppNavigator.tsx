/**
 * Main App Navigator
 * Handles authentication flow and main app navigation
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, AuthStackParamList, MainTabParamList, MaintenanceStackParamList } from './types';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { PlansScreen } from '../features/plans/screens/PlansScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { MaintenanceHomeScreen } from '../features/maintenance/screens/MaintenanceHomeScreen';
import { BasePhasesScreen } from '../features/basePhases/screens/BasePhasesScreen';
import { ProductsScreen } from '../features/products/screens/ProductsScreen';
import { FeaturesScreen } from '../features/features/screens/FeaturesScreen';
import { CalendarsScreen } from '../features/calendars/screens/CalendarsScreen';
import { ITOwnersScreen } from '../features/itOwners/screens/ITOwnersScreen';
import { LoadingScreen } from '../components/common';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();
const MaintenanceStack = createNativeStackNavigator<MaintenanceStackParamList>();

/**
 * Authentication Navigator
 */
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * Maintenance Stack Navigator
 */
function MaintenanceNavigator() {
  return (
    <MaintenanceStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <MaintenanceStack.Screen
        name="MaintenanceHome"
        component={MaintenanceHomeScreen}
        options={{ title: 'Maintenance' }}
      />
      <MaintenanceStack.Screen
        name="BasePhases"
        component={BasePhasesScreen}
        options={{ title: 'Base Phases' }}
      />
      <MaintenanceStack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Products' }}
      />
      <MaintenanceStack.Screen
        name="Features"
        component={FeaturesScreen}
        options={{ title: 'Features' }}
      />
      <MaintenanceStack.Screen
        name="Calendars"
        component={CalendarsScreen}
        options={{ title: 'Calendars' }}
      />
      <MaintenanceStack.Screen
        name="ITOwners"
        component={ITOwnersScreen}
        options={{ title: 'IT Owners' }}
      />
    </MaintenanceStack.Navigator>
  );
}

/**
 * Main Tab Navigator
 */
function MainNavigator() {
  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <MainTabs.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          title: 'Release Plans',
          tabBarLabel: 'Plans',
        }}
      />
      <MainTabs.Screen
        name="Maintenance"
        component={MaintenanceNavigator}
        options={{
          headerShown: false,
          title: 'Maintenance',
          tabBarLabel: 'Maintenance',
        }}
      />
      <MainTabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </MainTabs.Navigator>
  );
}

/**
 * Root Navigator
 */
export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading screen while checking auth
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

