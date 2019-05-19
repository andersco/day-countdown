import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

export default class LoggedIn extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //alert(this.props.photoUrl);
        let imageSource = { uri: this.props.photoUrl}
        return (
            <View>
                <Image style={{ width: 50, height: 50 }} source={imageSource} />
                <Text>{this.props.name} signed In</Text>
            </View>
        );
    }
}