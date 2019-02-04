import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PrimaryScreen from '../screens/PrimaryScreen';
import AlternativeScreen from '../screens/AlternativeScreen';
import JobsScreen from '../screens/JobsScreen';
import StartScreen from '../screens/StartScreen';
import CameraScreen from '../screens/CameraScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Primary: PrimaryScreen,
  Alternative: AlternativeScreen,
  Jobs: JobsScreen,
  Start: StartScreen,
  Camera: CameraScreen,

  });
const AppContainer = createAppContainer(HomeStack);

HomeStack.navigationOptions = {
	title: 'Welcome to the app!',

};


const PrimaryStack = createStackNavigator({
	Primary: PrimaryScreen,
});

PrimaryStack.navigationOptions = {
	title: 'Welcome to the app!',
  };

const CameraStack = createStackNavigator({
	Camera: CameraScreen,
});

CameraStack.navigationOptions = {
	title: 'Welcome to the app!',
  };

const AlternativeStack = createStackNavigator({
    Alternative: AlternativeScreen,
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
