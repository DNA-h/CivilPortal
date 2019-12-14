import React, {Component} from "react";
import {Image} from 'react-native';
import {RequestsController} from "../../Utils/RequestController";

export default class SimpleImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: ''
    }
  }

  async componentDidMount(): void {
    let mme = await RequestsController.loadMyself();
    this.setState({
      avatar: 'http://185.211.57.73/static/uploads/' + mme[0].fields.image
    })
  }

  render() {
    return (
      <Image
        style={{
          width: 120,
          height: 120,
          resizeMode: 'contain'
        }}
        source={{uri: this.state.avatar}}
      />
    )
  };
}