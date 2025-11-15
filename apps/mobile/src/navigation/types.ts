/**
 * Navigation types for type-safe navigation
 */
import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Plans: undefined;
  Maintenance: NavigatorScreenParams<MaintenanceStackParamList>;
  Settings: undefined;
};

export type MaintenanceStackParamList = {
  MaintenanceHome: undefined;
  BasePhases: undefined;
  Products: undefined;
  Features: undefined;
  Calendars: undefined;
  ITOwners: undefined;
};

export type PlansStackParamList = {
  PlansList: undefined;
  PlanDetail: { planId: string };
  CreatePlan: undefined;
};

// Extend global namespace for type-safe navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

