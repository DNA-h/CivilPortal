import React from 'react';
import {TextInput, Text, View, Image, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import ActionButton from "react-native-action-button";
import Modal from "react-native-modal";
import {RequestsController} from "./Utils/RequestController";
import SplashScreen from "react-native-splash-screen";
import LinearGradient from "react-native-linear-gradient";

export default class SaveAddressNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '', address: ''
    }
  }

  render() {
    return (<View style={{flex: 1, justifyContent: 'center'}}>
      <LinearGradient
        colors={['#5849a7', '#8787f0']}
        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
        style={{flex: 1, justifyContent: 'center'}}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF", borderRadius: 10, marginStart: 10, marginEnd: 10, paddingStart: 10, paddingEnd: 10, paddingBottom: 5
          }}>
          <TextInput
            style={{
              backgroundColor: '#7fb0ff', color: '#000', textAlign: 'center', fontFamily: 'byekan', height: 50, marginTop: 10
            }}
            autoCapitalize="none"
            onChangeText={(text) => {
              this.title = text
            }}
            defaultValue={''}
            autoCorrect={false}
            keyboardType='email-address'
            placeholder='عنوان آدرس ... مثلا خانه، دفتر مرکزی'
            placeholderTextColor='#ccc'/>
          <TextInput
            style={{
              backgroundColor: '#7fb0ff', color: '#000', textAlign: 'center', fontFamily: 'byekan', height: 50, marginTop: 10
            }}
            autoCapitalize="none"
            onChangeText={(text) => {
              this.address = text
            }}
            defaultValue={''}
            autoCorrect={false}
            keyboardType='email-address'
            placeholder='آدرس دقیق ...'
            placeholderTextColor='#ccc'/>
          <View
            style={{
              flexDirection: 'row', margin: 10, justifyContent: 'space-between', paddingEnd: 25, paddingStart: 25
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({visible: false})}>
              <View>
                <Text
                  style={{
                    fontFamily: 'IRANSansMobile',
                    paddingEnd: 15,
                    paddingStart: 15,
                    marginTop: 5,
                    marginBottom: 5,
                    fontSize: 17,
                    color: "#000000",
                    borderWidth: 1,
                    borderColor: "#000000",
                    borderRadius: 10,
                    marginStart: 15,
                    marginEnd: 15
                  }}>
                  انصراف
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={async () => {
                let center = await this._map.getCenter();
                console.log('center ', center);
                await RequestsController.saveAddress(this.title, this.address, center[0], center[1]);
                this.setState({visible: false})
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'IRANSansMobile',
                    paddingEnd: 15,
                    paddingStart: 15,
                    marginTop: 5,
                    marginBottom: 5,
                    fontSize: 17,
                    color: "#000000",
                    borderWidth: 1,
                    borderColor: "#000000",
                    borderRadius: 10,
                    marginStart: 15,
                    marginEnd: 15
                  }}>
                  تایید
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </LinearGradient>
    </View>);
  }

}