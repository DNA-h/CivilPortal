import React, {Component} from "react";
import {Image, Text, View} from 'react-native';
import {RequestsController} from "../../Utils/RequestController";
import Globals from "../../Utils/Globals";

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
    let temp = await RequestsController.loadMyself();
    this.setState({
      avatar: temp.image,
      name: temp.first_name + ' ' + temp.last_name,
      rank:  temp.rank
    })
  }

  render() {
    return (
      <View style={{alignItems:'center'}}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 4,
            borderColor: Globals.PRIMARY_DARK_BLUE,
            overflow: 'hidden'
          }}
        >
          <Image
            style={{
              width: 112,
              height: 112,
              resizeMode: 'cover'
            }}
            source={{uri: this.state.avatar}}
          />
        </View>
        <Text
          style={{
            width: '80%',
            fontSize:17,
            fontFamily: 'IRANSansMobile',
            color: '#FFF'
          }}
        >
          {this.state.name}
        </Text>
        <Text
          style={{
            width: '80%',
            fontFamily: 'IRANSansMobile',
            fontSize: 15,
            paddingHorizontal:15,
            textAlign: 'center',
            color: '#7e7e7e',
            backgroundColor: '#dddddd',
            borderRadius: 15,
          }}
        >
          {this.state.rank}
        </Text>
      </View>
    )
  };
}