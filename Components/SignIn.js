import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoggedOut from './LoggedOut';
import { Google } from "expo";
import * as SecureStore from 'expo-secure-store'
import { androidClientId } from '../secrets.json';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signingIn: false,
            signedIn: false
        }
    }

    async componentDidMount() {
        const access_token = await SecureStore.getItemAsync('access_token');
        if (access_token) {
            await this.redirectToList(access_token);
        }
    }

    async redirectToList(accessToken) {
        const { navigate } = this.props.navigation;
        navigate('list', { accessToken: accessToken });
    }

    signIn = async () => {
        try {
            let config = {
                clientId: androidClientId,
                scopes: ['https://www.googleapis.com/auth/drive.appdata']
            };
            await this.setState({ signingIn: true });
            const { type, accessToken } = await Google.logInAsync(config);
            await SecureStore.setItemAsync('access_token', accessToken);
            await this.setState({ signingIn: false });
            if (type === 'success') {
                console.log('successfully logged in')
                await this.setState({ signedIn: true });
                await this.redirectToList(accessToken);
            } else {
                console.log("cancelled. type is: " + type);
            }
        } catch (e) {
            console.log("error", e);
        }
    }
    render() {
        return (
            <View>
                {this.state.signingIn ? (<ActivityIndicator size="large" color="#0000ff" animating={true} />) : (<LoggedOut signIn={this.signIn} />)}
            </View>
        );
    }
}

export default SignIn;