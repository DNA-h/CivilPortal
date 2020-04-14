import React, {Component} from "react";
import {Image, Text, View} from 'react-native';
import {RequestsController} from "../../Utils/RequestController";
import Globals from "../../Utils/Globals";
import DBManager from "../../Utils/DBManager";

export default class SimpleImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      name: '',
      rank:''
    }
  }

  async componentDidMount(): void {
    let mme = await RequestsController.loadMyself();
    this.setState({
      avatar: mme.image,
      name: mme.first_name + ' ' + mme.last_name,
      rank:  mme.rank
    })
  }

  render() {
    return (
      <View style={{alignItems:'center'}}>
        <View
          style={{
            width: DBManager.RFWidth(40),
            height: DBManager.RFWidth(40),
            borderRadius: DBManager.RFWidth(20),
            borderWidth: 4,
            borderColor: Globals.PRIMARY_DARK_BLUE,
            overflow: 'hidden'
          }}
        >
          <Image
            style={{
              width: DBManager.RFWidth(38),
              height: DBManager.RFWidth(38),
              resizeMode: 'cover'
            }}
            source={{uri: this.state.avatar}}
          />
        </View>
        <Text
          style={{
            width: '80%',
            fontSize:17,
            fontFamily: 'byekan',
            color: '#FFF'
          }}
        >
          {this.state.name}
        </Text>
        <Text
          style={{
            width: '80%',
            fontSize:17,
            fontFamily: 'byekan',
            color: '#FFF'
          }}
        >
          {this.state.rank}
        </Text>
      </View>
    )
  };
}