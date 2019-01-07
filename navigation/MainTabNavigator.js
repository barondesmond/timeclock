import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PrimaryScreen from '../screens/PrimaryScreen';
import AlternativeScreen from '../screens/AlternativeScreen';
import JobsScreen from '../screens/JobsScreen';
import StartScreen from '../screens/StartScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Primary: PrimaryScreen,
  Alternative: AlternativeScreen,
  Jobs: JobsScreen,
  Start: StartScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Jobs',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Employees',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const PrimaryStack = createStackNavigator({
	Primary: PrimaryScreen,
});

PrimaryStack.navigationOptions = {
	title: 'Welcome to the app!',
  };

const AlternativeStack = createStackNavigator({
	Primary: PrimaryScreen,
    Alternative: AlternativeScreen,
    Jobs: JobsScreen,
});

AlternativeStack.navigationOptions = {
	title: 'Welcome to the app!',
  };

const JobsStack = createStackNavigator({
	Jobs: JobsScreen,
});

JobsStack.navigationOptions = {
	title: 'Welcome to the app!',
  };

const StartStack = createStackNavigator({
	Jobs: JobsScreen,
});

StartStack.navigationOptions = {
	title: 'Welcome to the app!',
  };

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});
