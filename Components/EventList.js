import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import EventCard from './EventCard';
import ActionButton from 'react-native-action-button';
import { loadDataFile } from '../googleDrive';

const styles = StyleSheet.create({
    list: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#F3F3F3'
    },
});

class EventList extends Component {
    state = {
        events: []
    }

    async componentDidMount() {
        const { navigation } = this.props;
        apiToken = navigation.getParam('accessToken', 'NO-accessToken');
        let events = await loadDataFile(apiToken);
        console.log('events:  ' + JSON.stringify(events));
        events = events.map(e => ({ ...e, date: new Date(e.date) }));
        await this.setState({ events });
        setInterval(() => {
            this.setState({
                events: this.state.events.map(evt => ({
                    ...evt,
                    timer: Date.now(),
                })),
            });
        }, 1000);

    }

    handleAddEvent = () => {
        this.props.navigation.navigate('form');
    }

    render() {
        return [
            <FlatList
                key="flatlist"
                style={styles.list}
                data={this.state.events}
                renderItem={({ item }) => <EventCard event={item} />}
                keyExtractor={item => item.id}
            />,
            <ActionButton key="fab" onPress={this.handleAddEvent} buttonColor="rgba(231,76,60,1)" />
        ];
    }
}

export default EventList;