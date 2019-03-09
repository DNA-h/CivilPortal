import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, Keyboard, Dimensions, ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from './Actions'
import Wallpaper from "./Components/Wallpaper";
import Logo from "./Components/Logo";
import Form from "./Components/Form";
import SignupSection from "./Components/SignupSection";
import ButtonCode from "./Components/ButtonCode";
import SplashScreen from "react-native-splash-screen";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ButtonSubmit from "./Components/ButtonSubmit";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class Login extends Component {

    constructor(props) {
        super(props);
        this.myRef = 1;
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
    }

    componentDidMount() {
        SplashScreen.hide();
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        //console.log('SV ', this.myRef);
        setTimeout(() =>
                this.myRef.scrollTo({y: 0.5 * DEVICE_HEIGHT - 80})
            , 100)
    }

    _keyboardDidHide() {
        setTimeout(() =>
                this.myRef.scrollTo({y: 0})
            , 100)
    }

    render() {
        return (
            <View
                style={{flex: 1}}>
                <ScrollView
                    ref={ref => this.myRef = ref}
                    style={{flex: 1}}>
                    <ImageBackground
                        style={{
                            flex: 1,
                            width: DEVICE_WIDTH,
                            height: DEVICE_HEIGHT,
                            resizeMode: 'stretch',
                        }}
                        source={require("./images/img_back01.png")}
                    >
                        <View style={{flex: 1}}/>
                        <View style={{flex: 3}}>
                            <View
                                elevation={5}
                                style={{
                                    position: 'absolute',
                                    top: -25,
                                    right: (DEVICE_WIDTH - 50) / 2,
                                    zIndex: 3,
                                    backgroundColor: '#7092be',
                                    borderRadius: 28,
                                    paddingHorizontal:6,
                                    paddingVertical:6,
                                }}>
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50,
                                        resizeMode: 'contain',
                                    }}
                                    source={require('./images/ic_no_profile.png')}/>
                            </View>
                            <View
                                elevation={5}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#FFFFFF',
                                    marginHorizontal: 40,
                                    zIndex: 2
                                }}>
                                <View style={{flex: 1}}/>
                                <Form page={1}/>
                                <View style={{flex: 1}}/>
                                <SignupSection/>
                                <ButtonCode page={0}/>
                            </View>
                        </View>
                        <View style={{flex: 1}}/>
                    </ImageBackground>
                    <KeyboardSpacer/>
                </ScrollView>
            </View>
        );
    }

}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(Login);
