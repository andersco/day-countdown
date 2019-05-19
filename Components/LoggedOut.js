import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class LoggedOut extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <Text>Sign in with your Google account to sync saved items to your Google Drive.</Text>
                <Button title="Sign In With Google" onPress={this.props.signIn} />
            </View >
        );
    }
}