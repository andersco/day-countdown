import EventList from './EventList';
import EventForm from './EventForm';
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator({
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