import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import { Google } from "expo";
import { androidClientId } from '../secrets.json';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            name: "",
            photoUrl: ""
        }
    }
    signIn = async () => {
        try {
            let config = {
                clientId: androidClientId,
                scopes: ['https://www.googleapis.com/auth/drive.appdata']
            }
            const { type, accessToken, user } = await Google.logInAsync(config);
            if (type === 'success') {
                await this.setState({
                    signedIn: true,
                    name: user.name,
                    photoUrl: user.photoUrl
                });
                const {navigate} = this.props.navigation;
                navigate('list', {accessToken: accessToken});
            } else {
                console.log("type is: " + type);
                console.log("cancelled");
            }
        } catch (e) {
            console.log("error", e);
        }
    }
    render() {
        return (
            <View>
                {this.state.signedIn ? (<LoggedIn name={this.state.name} photoUrl={this.state.photoUrl} />) : (<LoggedOut signIn={this.signIn} />)}
            </View>
        );
    }
}

export default SignIn;