import React, {Component} from 'react';
import {connect} from 'react-redux';
import {counterAdd, counterSub} from '../actions'
import {ScrollView, View, Dimensions, Text, TouchableWithoutFeedback, Image, TextInput, Button} from 'react-native';
import SplashScreen from "react-native-splash-screen";
import {RequestsController} from "../Utils/RequestController";
import NavigationService from "../service/NavigationService";
import DBManager from "../Utils/DBManager";


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPhoneNumber: true
    };
    this.text = '';
    this._sendCode = this._sendCode.bind(this);
    this._checkCode = this._checkCode.bind(this);
    this._TextChanged = this._TextChanged.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  _TextChanged(input) {
    this.text = input
  }

  async _sendCode() {
    let result = await RequestsController.loadToken(this.text);
    if (result === 'We texted you a login code.')
      this.setState({isPhoneNumber: false});
  }

  async _checkCode() {
    let result = await RequestsController.SendCode(this.text);
    if (result !== undefined && result.length === 40) {
      DBManager.saveSettingValue('token', result);
      NavigationService.navigate('MainPage', null);
    }
  }

  render() {
    let input = this.state.isPhoneNumber ?
      <TextInput
        style={{
          backgroundColor: '#7fb0ff',
          color: '#000',
          textAlign: 'center',
          fontFamily: 'byekan',
          flex: 1
        }}
        autoCapitalize="none"
        onChangeText={(text) => {
          this._TextChanged(text);
        }}
        autoCorrect={false}
        keyboardType='phone-pad'
        returnKeyType="next"
        placeholder='شماره تلفن ...'
        placeholderTextColor='#666'
      />
      :
      <TextInput
        style={{
          backgroundColor: '#7fb0ff',
          color: '#000',
          textAlign: 'center',
          fontFamily: 'byekan',
          flex: 1
        }}
        autoCapitalize="none"
        onChangeText={(text) => {
          this._TextChanged(text);
          if (text.length === 6) {
            this._checkCode();
          }
        }}
        autoCorrect={false}
        keyboardType='decimal-pad'
        returnKeyType="next"
        placeholder='کد شش رقمی ...'
        placeholderTextColor='#CCC'
      />;
    let button = this.state.isPhoneNumber ?
      <TouchableWithoutFeedback
        onPress={this._sendCode}>
        <View>
          <Text
            style={{
              borderRadius: 35,
              backgroundColor: "#c8c6f5",
              marginRight: 15,
              paddingHorizontal: 20,
              color: '#8c0aff',
              fontFamily: 'byekan'
            }}>
            ورود
          </Text>
        </View>
      </TouchableWithoutFeedback> : null;
    return (
      <View
        style={{
          backgroundColor: '#8c0aff',
          justifyContent: 'center',
          alignItems: 'center'
        }}>

        <Image
          source={require('../images/logo.png')}
          resizeMode={'contain'}
          style={{
            width: '20%',
            height: '20%',
            paddingTop: 70,
            marginTop: 70
          }}
        />

        <View
          style={{
            paddingLeft: 60,
            paddingRight: 60,
            width: '100%'
          }}
        >
          <View
            style={{
              backgroundColor: '#7fb0ff',
              paddingHorizontal: 20,
              paddingBottom: 5,
              paddingTop: 5,
              borderWidth: 1,
              width: '100%',
              marginTop: 10,
              borderStyle: 'solid',
              fontSize: 15,
              borderRadius: 25,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            {input}
            <Image
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain'
              }}
              source={require("../images/ic_user.png")}
            />
          </View>

        </View>

        <View
          style={{
            flexDirection: 'row',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderRadius: 80,
            margin: 12,
            paddingLeft: 60,
            paddingRight: 60,
          }}
        >
          {button}
          <View style={{flex: 1}}/>
          <Text
            style={{
              color: '#FFFFFF',
              marginLeft: 15,
              fontFamily: 'byekan'
            }}>
            رمز عبور را فراموش کرده اید؟
          </Text>

        </View>

        <Image
          style={{
            width: '80%',
            height: '50%',
            margin: 30,
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            resizeMode: 'contain'
          }}
          source={require('../images/user_login.png')}/>
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