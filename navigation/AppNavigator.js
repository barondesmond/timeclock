  import { createStackNavigator } from 'react-navigation';
  import HomeScreen from '../screens/HomeScreen';
  import CameraScreen from '../screens/CameraScreen';
  import AlternativeScreen from '../screens/AlternativeScreen';
  import JobsScreen from '../screens/JobsScreen';
  import StartScreen from '../screens/StartScreen';
  import { createAppContainer } from 'react-navigation';

  const AppNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    Camera: { screen: CameraScreen},
    Alternative: { screen: AlternativeScreen},
    Start: {screen: StartScreen},
    Jobs: {screen: JobsScreen},
  });

  const AppContainer = createAppContainer(AppNavigator);

  export default AppContainer;

