import React, {Component} from 'react'
import {connect} from 'react-redux';
import {
  View, Text, TouchableWithoutFeedback,
  Image, TextInput, ImageBackground, ToastAndroid
} from 'react-native';
import SplashScreen from "react-native-splash-screen";
import {RequestsController} from "../Utils/RequestController";
import NavigationService from "../service/NavigationService";
import DBManager from "../Utils/DBManager";
import Globals from "../Utils/Globals";
import Toast from './Components/EasyToast';

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
    else
      this.refs.toast.show('خطایی در ارسال کد رخ داده است. لطفا شماره همراه خود را چک نمایید و مجددا تلاش نمایید');
  }

  async _checkCode() {
    let result = await RequestsController.SendCode(this.text);
    if (result !== undefined && result.length === 40) {
      DBManager.saveSettingValue('token', result);
      NavigationService.reset('MainPage', null);
    }else {
      this.refs.toast.show('کد وارد شده صحیح نیست یا منقضی شده است. لطفا مجددا تلاش نمایید.');
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../images/main.png')}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>

          <View style={{flex: 2}}/>
          <Image
            source={require('../images/logo_main.png')}
            resizeMode={'contain'}
            style={{
              width: '30%',
              height: '30%',
              marginRight: 25,
              marginTop: 40
            }}
          />

          <View
            style={{
              paddingLeft: 60,
              paddingRight: 60,
              marginTop: 20,
              width: '100%'
            }}
          >
            <View
              style={{
                backgroundColor: '#817ce2',
                paddingHorizontal: 20,
                paddingBottom: 5,
                paddingTop: 5,
                width: '100%',
                marginTop: 10,
                borderStyle: 'solid',
                fontSize: 15,
                borderRadius: 25,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              {
                this.state.isPhoneNumber ?
                  <TextInput
                    style={{
                      backgroundColor: '#817ce2',
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'IRANSansMobile',
                      flex: 1,
                      fontSize:12
                    }}
                    autoCapitalize="none"
                    onChangeText={(text) => {
                      this._TextChanged(text);
                    }}
                    autoCorrect={false}
                    keyboardType='phone-pad'
                    returnKeyType="next"
                    placeholder='شماره تلفن همراه خود را وارد نمایید'
                    placeholderTextColor={'#d9d9d9'}
                  />
                  :
                  <TextInput
                    style={{
                      backgroundColor: '#817ce2',
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'IRANSansMobile',
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
                    maxLength={6}
                    keyboardType='decimal-pad'
                    returnKeyType="next"
                    placeholder='کد تایید شش رقمی '
                    placeholderTextColor={'#d9d9d9'}
                  />
              }
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: 'white'
                }}
                source={require("../images/ic_no_profile_empty.png")}
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
            {
              this.state.isPhoneNumber ?
                <TouchableWithoutFeedback
                  onPress={this._sendCode}>
                  <View>
                    <Text
                      style={{
                        borderRadius: 35,
                        backgroundColor: "#c8c6f5",
                        marginRight: 15,
                        paddingHorizontal: 30,
                        paddingVertical: 5,
                        color: Globals.PRIMARY_BLUE,
                        fontFamily: 'IRANSansMobile'
                      }}>
                      ورود
                    </Text>
                  </View>
                </TouchableWithoutFeedback> : null
            }
            <View style={{flex: 1}}/>

          </View>

          <View style={{flex: 1}}/>

        </View>
        <Toast
          ref="toast"
          style={{
            backgroundColor: '#444',
            marginHorizontal: 50
          }}
          position='center'
          positionValue={200}
          fadeInDuration={200}
          fadeOutDuration={5000}
          opacity={0.8}
          textStyle={{
            color: 'white',
            fontFamily: 'IRANSansMobile',
            fontSize: 15,
            textAlign: 'center'
          }}
        />
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {})(Login);
