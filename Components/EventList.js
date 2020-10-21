import React, { Component } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Button } from 'react-native';
import EventCard from './EventCard';
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
            events: [],
            busy: false
        };
    }

    handleAddEvent = () => {
        this.props.navigation.navigate('form', { onGoBack: async () => this.populateData() });
    }

    handleEditEvent = (id) => {
        this.props.navigation.navigate('form', { id: id, onGoBack: async () => this.populateData() });
    }

    async componentDidMount() {
        await this.populateData();
    }

    async populateData() {
        this.db = new eventsDB();
        await this.db.init();
        await this.setState({ busy: true });
        let events = await this.db.getEvents();
        let eventsArray = Object.keys(events).map((key) => {
            return { id: key, ...events[key], date: new Date(events[key].date) };
        });
        await this.setState({ events: eventsArray, busy: false });
        setInterval(() => {
            this.setState({
                events: this.state.events.map(evt => ({
                    ...evt,
                    timer: Date.now(),
                })),
            });
        }, 60000);
    }

    render() {
        return [
            <View key="busyIndicator">{this.state.busy ? (<ActivityIndicator size="large" color="#0000ff" animating={true} />) : null}</View>,
            <FlatList
                key="flatlist"
                style={styles.list}
                data={this.state.events}
                renderItem={({ item }) => <EventCard event={item} onPress={this.handleEditEvent} />}
                keyExtractor={item => item.id}
            />,
            <Button title="Add" key="fab" onPress={this.handleAddEvent} color="#48BBEC" />
        ];
    }
}

export default EventList;