import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDateTime } from '../utils';
import eventsDB from '../eventsDB';

const styles = StyleSheet.create({
    fieldContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    text: {
        height: 40,
        margin: 0,
        marginRight: 7,
        paddingLeft: 10
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    borderTop: {
        borderColor: '#edeeef',
        borderTopWidth: 0.5,
    }
});

class EventForm extends Component {
    constructor(props) {
        super(props);
        this.db = null;
        this.state = {
            apiToken: null,
            title: null,
            date: '',
            busy: false
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        apiToken = navigation.getParam('apiToken', 'NO-accessToken');
        this.db = new eventsDB(apiToken);
        id = navigation.getParam('id', '');
        if (id) {
            await this.setState({ id: id, busy: true });
            let event = await this.db.getEvent(id);
            await this.setState({
                title: event.title,
                date: event.date,
                busy: false
            });
        }
        await this.setState({ apiToken: apiToken });
    }

    handleSavePress = async () => {
        await this.setState({ busy: true });
        if (this.state.id) {
            await this.db.saveEvent({ "id": this.state.id, "title": this.state.title, "date": this.state.date });
        } else {
            await this.db.createEvent({ "title": this.state.title, "date": this.state.date });
        }
        await this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

    handleDeletePress = async () => {
        await this.setState({ busy: true });
        await this.db.deleteEvent(this.state.id);
        await this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

    handleChangeTitle = (value) => {
        this.setState({ title: value });
    }

    handleDatePressed = () => {
        this.setState({ showDatePicker: true });
    }

    handleDatePicked = (date) => {
        this.setState({
            date
        });
        this.handleDateHide();
    }

    handleDateHide = () => {
        this.setState({ showDatePicker: false });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.fieldContainer}>
                    <TextInput style={styles.text}
                        placeholder="Event title"
                        spellCheck={false}
                        value={this.state.title}
                        onChangeText={this.handleChangeTitle} />
                    <TextInput style={[styles.text, styles.borderTop]}
                        placeholder="Event date"
                        spellCheck={false}
                        value={formatDateTime(this.state.date.toString())}
                        editable={!this.state.showDatePicker}
                        onFocus={this.handleDatePressed} />
                    <DateTimePicker isVisible={this.state.showDatePicker} mode="datetime" onConfirm={this.handleDatePicked} onCancel={this.handleDateHide} />
                </View>
                <TouchableHighlight onPress={this.handleSavePress} style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
                {this.state.id &&
                    <TouchableHighlight onPress={this.handleDeletePress} style={styles.button}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableHighlight>
                }
                {this.state.busy ? (<ActivityIndicator size="large" color="#0000ff" animating={true} />) : null}
            </View>
        );
    }
}

export default EventForm;