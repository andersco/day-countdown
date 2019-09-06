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
                <Text style={styles.text}>Sign in with your Google account to sync saved items to your Google Drive.</Text>
                <Button title="Sign In With Google" onPress={this.props.signIn} />
            </View >
        );
    }
}