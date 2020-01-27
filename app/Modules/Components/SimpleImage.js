import React, {Component} from "react";
import {Image, Text, View} from 'react-native';
import {RequestsController} from "../../Utils/RequestController";

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
      avatar: 'http://185.211.57.73/static/uploads/' + mme[0].fields.image,
      name: mme[0].fields.first_name + ' ' + mme[0].fields.last_name,
      rank:  mme[0].rank
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
            borderWidth: 2,
            borderColor: '#FFF',
            overflow: 'hidden'
          }}
        >
          <Image
            style={{
              width: 120,
              height: 120,
              resizeMode: 'cover'
            }}
            source={{uri: this.state.avatar}}
          />
        </View>
        <Text
          style={{
            width: '80%',
            fontFamily: 'byekan',
            color: '#FFF'
          }}
        >
          {this.state.name}
        </Text>
      </View>
    )
  };
}