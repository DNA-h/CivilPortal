import React, {Component} from 'react';
import {View, ScrollView, Keyboard, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from './Actions'
import Wallpaper from "./Components/Wallpaper";
import Logo from "./Components/Logo";
import Form from "./Components/Form";
import SignupSection from "./Components/SignupSection";
import ButtonCode from "./Components/ButtonCode";
import SplashScreen from "react-native-splash-screen";

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
                        <View style={{flex: 1}}/>
                        <Logo/>
                        <View style={{flex: 1}}/>
                        <Form page={1}/>
                        <View style={{flex: 1}}/>
                        {<SignupSection/>}
                        <ButtonCode/>
                    </Wallpaper>
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
