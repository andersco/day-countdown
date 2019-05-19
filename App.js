import EventList from './Components/EventList';
import EventForm from './Components/EventForm';
import SignIn from './Components/SignIn';
import { createStackNavigator, createAppContainer } from "react-navigation";

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
      title: 'Your Events'
    })
  },
  form: {
    screen: EventForm,
    navigationOptions: () => ({
      title: 'Add New Event'
    })
  }
});

export default createAppContainer(AppNavigator);