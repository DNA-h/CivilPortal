import React, {Component} from "react";
import Wallpaper from "../Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../../actions";
import {ImageBackground, Text, Image, Dimensions, View, TouchableOpacity} from 'react-native';
import Globals from "../../Utils/Globals";
import NavigationService from "../../service/NavigationService";
import DBManager from "../../Utils/DBManager";

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class OnBoarding extends Component {

  componentDidMount() {
    //SplashScreen.hide();
  }

  render() {
    return (
      <ImageBackground
        source={require('../../images/onboarding.jpg')}
        style={{flex: 1, width: DEVICE_WIDTH,}}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{flex: 1}}/>
          <TouchableOpacity
            onPress={()=>{
              DBManager.saveSettingValue('onboarding','done');
              NavigationService.reset("MainPage")
            }}
          >
            <View
              style={{
                backgroundColor:Globals.PRIMARY_BLUE,
                paddingHorizontal:15,
                borderRadius:20,
                flexDirection:'row',
                alignItems:'center'
              }}
            >
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 18,
                  textAlign: 'center',
                  color: 'white',
                  paddingHorizontal: 5
                }}
              >
                شروع
              </Text>
              <Image
                style={{
                  width:20,
                  height:20,
                  tintColor:'white',
                  transform:[{rotate:'180deg'}]
                }}
                source={require("../../images/ic_back.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(OnBoarding);
