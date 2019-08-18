import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TextInput, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDateTime, saveEvent } from '../utils';
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
            date: ''
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        apiToken = navigation.getParam('apiToken', 'NO-accessToken');
        this.db = new eventsDB(apiToken);
        id = navigation.getParam('id', '');
        if (id) {
            console.log('id passed, looking up...');
            await this.setState({ id: id });
        }
        await this.setState({ apiToken: apiToken });
    }

    handleAddPress = async () => {
        await this.db.createEvent(this.state);
        this.props.navigation.goBack();
    }

    handleDeletePress = async () => {
        await this.db.deleteEvent(this.state.id);
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
                        value={this.state.value}
                        onChangeText={this.handleChangeTitle} />
                    <TextInput style={[styles.text, styles.borderTop]}
                        placeholder="Event date"
                        spellCheck={false}
                        value={formatDateTime(this.state.date.toString())}
                        editable={!this.state.showDatePicker}
                        onFocus={this.handleDatePressed} />
                    <DateTimePicker isVisible={this.state.showDatePicker} mode="datetime" onConfirm={this.handleDatePicked} onCancel={this.handleDateHide} />
                </View>
                <TouchableHighlight onPress={this.handleAddPress} style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
                {this.state.id &&
                    <TouchableHighlight onPress={this.handleDeletePress} style={styles.button}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableHighlight>
                }
            </View>
        );
    }
}

export default EventForm;