  import { createStackNavigator } from 'react-navigation';
  import HomeScreen from '../screens/HomeScreen';
  import CameraScreen from '../screens/CameraScreen';
  import AlternativeScreen from '../screens/AlternativeScreen';
  import JobScreen from '../screens/JobScreen';
  import DispatchScreen from '../screens/DispatchScreen';
  import EmployeeScreen from '../screens/EmployeeScreen';

  import { createAppContainer } from 'react-navigation';

  const AppNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    Camera: { screen: CameraScreen},
    Alternative: { screen: AlternativeScreen},
    Job: {screen: JobScreen},
	Dispatch: {screen: DispatchScreen},
	Employee: {screen: EmployeeScreen},

	});

  const AppContainer = createAppContainer(AppNavigator);

  export default AppContainer;

