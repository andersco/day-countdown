import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LoggedOut from './LoggedOut';
import * as Constants from 'expo-constants';
import * as AppAuth from 'expo-app-auth';
import * as SecureStore from 'expo-secure-store';
import { androidClientIdExpo, androidClientIdAndroid } from '../secrets.json';

const isInClient = Constants.default.appOwnership === 'expo';

const clientId = isInClient
  ? androidClientIdExpo
  : androidClientIdAndroid;

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signingIn: false,
            signedIn: false
        };
        this.signInConfig = {
            issuer: 'https://accounts.google.com',
            scopes: ['https://www.googleapis.com/auth/drive.appdata'],
            clientId: clientId
        };
    }

    async componentDidMount() {
        try {
            const access_token = await SecureStore.getItemAsync('access_token');
            if (access_token) {
                console.log('access_token found, checking it...');
                const accessTokenExpirationDate = await SecureStore.getItemAsync('access_token_expiration_date');
                if (this.checkIfTokenExpired(accessTokenExpirationDate)) {
                    console.log('access_token expired, refreshing it...');
                    const refresh_token = await SecureStore.getItemAsync('refresh_token');
                    const response = await AppAuth.refreshAsync(this.signInConfig, refresh_token);
                    await this.saveTokens(response);
                }
                console.log('using existing access_token');
                await this.redirectToList();
            }
        } catch (error) {
            // if there was an error refreshing the token, just stay in the signin page to get a new access token
            console.log('error in componentDidMount: ' + error);
        }
    }

    checkIfTokenExpired(accessTokenExpirationDate) {
        let now = new Date();
        let expirationDate = new Date(accessTokenExpirationDate);
        console.log(`time is: ${now}, token expires: ${expirationDate}`);
        return expirationDate < now;
    }

    async saveTokens(appAuthResponse) {
        console.log('saving tokens from response: ' + JSON.stringify(appAuthResponse));
        const { accessToken, accessTokenExpirationDate, refreshToken } = appAuthResponse;
        await SecureStore.setItemAsync('access_token', accessToken);
        await SecureStore.setItemAsync('access_token_expiration_date', accessTokenExpirationDate.toString());
        if (refreshToken) {
            await SecureStore.setItemAsync('refresh_token', refreshToken);
        }
    }

    async redirectToList(accessToken) {
        const { navigate } = this.props.navigation;
        navigate('list');
    }

    signIn = async () => {
        try {
            await this.setState({ signingIn: true });
            const response = await AppAuth.authAsync(this.signInConfig);
            await this.saveTokens(response);
            await this.setState({ signingIn: false });
            console.log('successfully logged in')
            await this.setState({ signedIn: true });
            await this.redirectToList();
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