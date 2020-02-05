import React from 'react';
import {ActivityIndicator, Text, View, Image, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import Modal from "react-native-modal";
import {RequestsController} from "../Utils/RequestController";
import SplashScreen from "react-native-splash-screen";
import NavigationService from "../service/NavigationService";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect} from "react-redux";
import {setURI} from "../actions";

MapboxGL.setAccessToken("pk.eyJ1IjoiZG5hLWgiLCJhIjoiY2p2eGN3ZG1lMDNpcTQ0cnpvMHBobm5ubSJ9.anMU_gz8N2Hl7H0oTgtINg");

class SaveAddress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '',
      address: '',
      clicked: false
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
            fontFamily: 'IRANSansMobile',
            color: '#000000',
            width: '100%',
            fontSize: 20,
            textAlign: 'center'
          }}>
          محل مورد نظر را روی نقشه تعیین نمایید و دکمه تایید را فشار دهید.
        </Text>
        <MapboxGL.MapView
          centerCoordinate={[51.38644110964526, 35.72967255243659]}
          zoomLevel={12}
          ref={(ref) => this._map = ref}
          style={{flex: 1, width: '100%'}}/>
        {!this.state.clicked &&
        <Image
          style={{
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
        }
        {this.state.clicked &&
        <ActivityIndicator
          size={70}
          color="#1DB954"
          style={{
            width: 70,
            height: 70,
            position: 'absolute',
            top: (h - 70) / 2,
            bottom: (h - 70) / 2,
            left: (w - 70) / 2,
            right: (w - 70) / 2,
            resizeMode: 'contain',
            tintColor: '#ff6b06'
          }}
        />
        }
        <TouchableWithoutFeedback
          onPress={
            async () => {
              this.setState({clicked: true});
              let center = await this._map.getCenter();
              this.setState({visible: false});
              const uri = await MapboxGL.snapshotManager.takeSnap({
                centerCoordinate: center,
                width: wp(95),
                height: hp(20),
                zoomLevel: 12,
                pitch: 0,
                heading: 20,
                styleURL: MapboxGL.StyleURL.Street,
                withLogo: false, // Disable Mapbox logo (Android only)
              });
              this.props.setURI(uri, center[0], center[1]);
              NavigationService.goBack();
            }}
        >
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              fontSize: 18,
              fontFamily: 'IRANSansMobile'
            }}
            source={require("../images/ic_location.png")}
          >
            تایید
          </Text>
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