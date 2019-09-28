import EventList from './Components/EventList';
import EventForm from './Components/EventForm';
import SignIn from './Components/SignIn';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const AppNavigator = createStackNavigator({
  signIn: {
    screen: SignIn,
    navigationOptions: () => ({
      title: 'Sign In'
    })
  },
  list: {
    screen: EventList,
    navigationOptions: () => ({
      title: 'Your Events',
      headerLeft: null
    })
  },
  form: {
    screen: EventForm,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('title', 'Add New Event')
      };
    }
  }
});

export default createAppContainer(AppNavigator);