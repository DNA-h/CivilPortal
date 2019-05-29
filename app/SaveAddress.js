import React from 'react';
import {View} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

MapboxGL.setAccessToken("pk.eyJ1IjoiZG5hLWgiLCJhIjoiY2p2eGN3ZG1lMDNpcTQ0cnpvMHBobm5ubSJ9.anMU_gz8N2Hl7H0oTgtINg");

export default class SaveAddress extends React.Component {

    render() {
        return (
            <View style={{flex: 1}}>
                <MapboxGL.MapView/>
            </View>
        );
    }

}