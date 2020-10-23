import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        margin: 25
    },
    text: {
        marginBottom: 10
    }
});

export default class LoggedOut extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Sign in to sync your saved items to the cloud.</Text>
                <Button title="Sign In" onPress={this.props.signIn} />
            </View >
        );
    }
}