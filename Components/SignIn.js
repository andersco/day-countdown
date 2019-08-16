import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoggedOut from './LoggedOut';
import { Google } from "expo";
import { androidClientId } from '../secrets.json';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false
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
                console.log('successfully logged in')
                await this.setState({
                    signedIn: true
                });
                const {navigate} = this.props.navigation;
                navigate('list', {accessToken: accessToken});
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
                {this.state.signedIn ? (<ActivityIndicator size="large" color="#0000ff" animating={true} />) : (<LoggedOut signIn = {this.signIn}/>)}
            </View>
        );
    }
}

export default SignIn;