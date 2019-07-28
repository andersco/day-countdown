import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

export default class LoggedIn extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let imageSource = { uri: this.props.photoUrl}
        return (
            <View>
                <Text>Signed In</Text>
            </View>
        );
    }
}