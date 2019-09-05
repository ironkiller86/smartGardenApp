import Ionicons from 'react-native-vector-icons/Ionicons';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomePage from '../HomePage/index';
import SettingBluetooth from './../SettingBluetooth/index';



/*const tabBarOptions: {
  activeTintColor: '#e91e63',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: 'blue',
  },
}

*/


const TabNavigator = createBottomTabNavigator({
    Home: HomePage,
    Settings: SettingBluetooth,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = `home${focused ? '' : '-outline'}`;
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
         // IconComponent = HomeIconWithBadge;
        } else if (routeName === 'Settings') {
          iconName = 'ios-options'
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 15,
      },
      style: {
       
      },
    },
  }



  );
  
  export default createAppContainer(TabNavigator);