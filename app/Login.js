import React, {Component} from 'react';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from './Actions'
import Wallpaper from "./Components/Wallpaper";
import Logo from "./Components/Logo";
import Form from "./Components/Form";
import {KeyboardAvoidingView, SafeAreaView, ScrollView, View, Dimensions, Keyboard} from 'react-native';
import SignupSection from "./Components/SignupSection";
import ButtonSubmit from "./Components/ButtonSubmit";
import SplashScreen from "react-native-splash-screen";
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
                    <Wallpaper>
                        <Logo/>
                        <View style={{flex: 1}}/>
                        <Form page={0}/>
                        <View style={{flex: 1}}/>
                        <SignupSection/>
                        <ButtonSubmit page={0}/>
                    </Wallpaper>
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
