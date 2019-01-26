import React, {Component} from 'react';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from './Actions'
import Wallpaper from "./Components/Wallpaper";
import Logo from "./Components/Logo";
import Form from "./Components/Form";
import SignupSection from "./Components/SignupSection";
import ButtonSubmit from "./Components/ButtonSubmit";

class Login extends Component{

    render() {
        return (
            <Wallpaper>
                <Logo />
                <Form page={0}/>
                <SignupSection />
                <ButtonSubmit page={0}/>
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