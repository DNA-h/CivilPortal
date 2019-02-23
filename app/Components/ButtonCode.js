import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
    Easing,
    Image,
    AsyncStorage,
    View,
} from 'react-native';

import spinner from '../images/loading.gif';
import {connect} from "react-redux";
import {navSendCode} from "../Actions";
import NavigationService from "../Service/NavigationService";
import {ConnectionManager} from "../Utils/ConnectionManager";
import DBManager from "../Utils/DBManager";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

class ButtonCode extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: false,
        };

        this.buttonAnimated = new Animated.Value(0);
        this.growAnimated = new Animated.Value(0);
        this._onPress = this._onPress.bind(this);
    }

    async _onPress() {
        if (this.state.isLoading) return;

        this.setState({isLoading: true});
        Animated.timing(this.buttonAnimated, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
        }).start();

        let token = await ConnectionManager.confirmCode(this.props.state.currentCode);
        if (token !== undefined && token !== null && token[0].token.toString().length === 10) {
            DBManager.saveSettingValue('token', token[0].token);
            NavigationService.navigate('MainPage', null);
        }
        console.log('calling navSendCode ', token[0].token);
        this.setState({isLoading: false});
        this.buttonAnimated.setValue(0);
        this.growAnimated.setValue(0);
    }

    render() {
        const changeWidth = this.buttonAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
        });
        const changeScale = this.growAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, MARGIN],
        });

        return (
            <View style={styles.container}>
                <Animated.View style={{width: changeWidth}}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this._onPress}
                        activeOpacity={1}>
                        {this.state.isLoading ? (
                            <Image source={spinner} style={styles.image}/>
                        ) : (
                            <Text style={styles.text}>
                                ارسال
                            </Text>
                        )}
                    </TouchableOpacity>
                    <Animated.View
                        style={[styles.circle, {transform: [{scale: changeScale}]}]}
                    />
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 35,
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F035E0',
        height: MARGIN,
        borderRadius: 20,
        zIndex: 100,
    },
    circle: {
        height: MARGIN,
        width: MARGIN,
        marginTop: -MARGIN,
        borderWidth: 1,
        borderColor: '#F035E0',
        borderRadius: 100,
        alignSelf: 'center',
        zIndex: 99,
        backgroundColor: '#F035E0',
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
        fontFamily: 'byekan'
    },
    image: {
        width: 24,
        height: 24,
    },
});


function mapStateToProps(state) {
    return {
        state: state
    }
}

export default connect(mapStateToProps, {navSendCode})(ButtonCode);
