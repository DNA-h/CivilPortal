import React, {Component} from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from './Actions'
import Wallpaper from "./Components/Wallpaper";
import Logo from "./Components/Logo";
import Form from "./Components/Form";
import SignupSection from "./Components/SignupSection";
import ButtonCode from "./Components/ButtonCode";

class Login extends Component{

    render() {
        return (
            <Wallpaper>
                <Logo />
                <Form page={1}/>
                {<SignupSection />}
                <ButtonCode/>
            </Wallpaper>
        );
    }

}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(Login);
