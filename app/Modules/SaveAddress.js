import React from 'react';
import {
  ActivityIndicator, Text, View, Image, TouchableNativeFeedback,
  Dimensions, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import Mapir from 'mapir-react-native-sdk';
import Mapbox from 'mapir-mapbox';
import Modal from "react-native-modal";
import {RequestsController} from "../Utils/RequestController";
import SplashScreen from "react-native-splash-screen";
import NavigationService from "../service/NavigationService";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect} from "react-redux";
import {setURI} from "../actions";
import Globals from "../Utils/Globals";

Mapbox.apiKey(Globals.ACCESS_TOKEN);

class SaveAddress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      address: '',
    };
    this.latitude = 0;
    this.longitude = 0
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  moveToUserLocation = () => {
    if (this.latitude !== 0 && this._camera !== undefined) {
      this._camera.zoomTo(12, 100);
      setTimeout(() => {
        this._camera.flyTo([this.longitude, this.latitude], 2000);
      }, 210);
    }
  };

  render() {
    let w = Dimensions.get('window').width;
    let h = Dimensions.get('window').height;
    return (
      <View style={{flex: 1, backgroundColor: Globals.PRIMARY_BLUE}}>
        <Text
          style={{
            fontFamily: 'byekan',
            color: '#FFFFFF',
            fontSize: 20,
            marginHorizontal: 40,
            marginVertical: 5,
            textAlign: 'center'
          }}>
          محل مورد نظر را روی نقشه تعیین نمایید و دکمه تایید را فشار دهید.
        </Text>
        <Mapbox.MapView
          ref={(ref) => this._map = ref}
          style={{flex: 1, width: '100%', zIndex: 2000}}>
          <Mapbox.Camera
            zoomLevel={12}
            centerCoordinate={[
              Math.floor(this.props.counter.x) === 0 ? 51.38644110964526 : this.props.counter.x,
              Math.floor(this.props.counter.y) === 0 ? 35.72967255243659 : this.props.counter.y
            ]}
            ref={(ref) => {
              this._camera = ref;
            }}
          />
          <Mapir.UserLocation
            visible
            animated
            onUpdate={(evt) => {
              this.latitude = evt.coords.latitude;
              this.longitude = evt.coords.longitude;
            }}
          />
        </Mapbox.MapView>
        <Image
          style={{
            zIndex: 2001,
            width: 40,
            height: 40,
            position: 'absolute',
            top: (h - 40) / 2,
            bottom: (h - 40) / 2,
            left: (w - 40) / 2,
            right: (w - 40) / 2,
            resizeMode: 'contain',
            tintColor: '#ff6b06'
          }}
          source={require("../images/ic_location.png")}
        />
        <TouchableWithoutFeedback
          onPressIn={this.moveToUserLocation}
          style={{zIndex: 3000}}
          onPress={this.moveToUserLocation}
        >
          <View
            style={{
              zIndex: 3000,
              position: 'absolute',
              right: 15,
              bottom: 90,
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000'
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFF'
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: '#000'
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={
            async () => {
              let center = await this._map.getCenter();
              this.props.setURI(center[0], center[1]);
              NavigationService.goBack();
            }}
        >
          <View
            style={{
              marginVertical: 10,
              marginBottom: 20,
              flexDirection: 'row',
              backgroundColor: '#FFFFFF',
              borderRadius: 30,
              paddingVertical: 2,
              paddingHorizontal: 25,
              marginHorizontal: 25
            }}
          >
            <Image
              style={{
                height: 16,
                width: 24,
                marginLeft: 20,
                alignSelf: 'center',
                tintColor: '#675ec9'
              }}
              source={require("../images/arrow-back.png")}
            />
            <Text
              style={{
                fontFamily: 'byekan',
                fontSize: 22,
                width: '80%',
                textAlign: 'center',
                color: '#675ec9',
                alignSelf: 'center',
              }}
            >
              تایید
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {setURI})(SaveAddress);