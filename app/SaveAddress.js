import React from 'react';
import {TextInput, Text, View, Image, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import ActionButton from "react-native-action-button";
import Modal from "react-native-modal";
import {RequestsController} from "./Utils/RequestController";
import SplashScreen from "react-native-splash-screen";

MapboxGL.setAccessToken("pk.eyJ1IjoiZG5hLWgiLCJhIjoiY2p2eGN3ZG1lMDNpcTQ0cnpvMHBobm5ubSJ9.anMU_gz8N2Hl7H0oTgtINg");

export default class SaveAddress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      address: ''
    }
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    let w = Dimensions.get('window').width;
    let h = Dimensions.get('window').height;
    return (
      <View style={{flex: 1}}>
        <Text
          style={{
            fontFamily: 'byekan',
            color: '#000000',
            width: '100%',
            fontSize: 13,
            textAlign: 'center'
          }}>
          محل مورد نظر را روی نقشه تعیین نمایید و دکمه + را فشار دهید.
        </Text>
        <MapboxGL.MapView
          centerCoordinate={[51.38644110964526, 35.72967255243659]}
          zoomLevel={12}
          ref={(ref) => this._map = ref}
          style={{flex: 1, width: '100%'}}/>
        <Image
          style={{
            width: 50,
            height: 50,
            position: 'absolute',
            top: (h - 50) / 2,
            bottom: (h - 50) / 2,
            left: (w - 50) / 2,
            right: (w - 50) / 2,
            resizeMode: 'contain'
          }}
          source={require("./images/ic_location.png")}/>
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => this.setState({visible: true})}>
        </ActionButton>
        <Modal
          isVisible={this.state.visible}
          onBackdropPress={() => this.setState({visible: false})}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              marginStart: 10,
              marginEnd: 10,
              paddingStart: 10,
              paddingEnd: 10,
              paddingBottom: 5
            }}>
            <TextInput
              style={{
                backgroundColor: '#7fb0ff',
                color: '#000',
                textAlign: 'center',
                fontFamily: 'byekan',
                height: 50,
                marginTop: 10
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
                backgroundColor: '#7fb0ff',
                color: '#000',
                textAlign: 'center',
                fontFamily: 'byekan',
                height: 50,
                marginTop: 10
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
                flexDirection: 'row',
                margin: 10,
                justifyContent: 'space-between',
                paddingEnd: 25,
                paddingStart: 25
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
                  await RequestsController.saveAddress(this.title, this.address,
                    center[0], center[1]);
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
        </Modal>
      </View>
    );
  }

}