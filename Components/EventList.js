import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import EventCard from './EventCard';
import ActionButton from 'react-native-action-button';
import eventsDB from '../eventsDB';

const styles = StyleSheet.create({
    list: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#F3F3F3'
    },
});

class EventList extends Component {
    constructor(props) {
        super(props);
        this.db = null;
        this.state = {
            apiToken: null,
            events: []
        };
    }

    handleAddEvent = () => {
        this.props.navigation.navigate('form', { apiToken: this.state.apiToken, onGoBack: async () => this.populateData() });
    }

    handleEditEvent = (id) => {
        this.props.navigation.navigate('form', { apiToken: this.state.apiToken, id: id, onGoBack: async () => this.populateData() });
    }

    async componentDidMount() {
        await this.populateData();
    }

    async populateData() {
        const { navigation } = this.props;
        apiToken = navigation.getParam('accessToken', 'NO-accessToken');
        this.db = new eventsDB(apiToken);
        await this.setState({ apiToken: apiToken });
        let events = await this.db.getEvents();
        let eventsArray = Object.keys(events).map((key) => {
            return { id: key, ...events[key], date: new Date(events[key].date) };
        })
        await this.setState({ eventsArray });
        setInterval(() => {
            this.setState({
                events: this.state.eventsArray.map(evt => ({
                    ...evt,
                    timer: Date.now(),
                })),
            });
        }, 1000);
    }

    render() {
        return [
            <FlatList
                key="flatlist"
                style={styles.list}
                data={this.state.events}
                renderItem={({ item }) => <EventCard event={item} onPress={this.handleEditEvent} />}
                keyExtractor={item => item.id}
            />,
            <ActionButton key="fab" onPress={this.handleAddEvent} buttonColor="rgba(231,76,60,1)" />
        ];
    }
}

export default EventList;