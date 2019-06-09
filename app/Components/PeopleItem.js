import React, {Component} from "react";
import {Text, View, CheckBox, Image} from 'react-native';
import Wallpaper from "./Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../Actions";

class PeopleItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };
  }

  render() {
    let check = this.props.showCheck === false ? null :
      <CheckBox
        value={this.state.isSelected}
        onValueChange={() => {
          this.setState(() => {
              this.props.callback(
                this.props.item.item.first_name,
                this.props.item.item.last_name,
                this.props.item.item.mobile,
                this.props.item.item.rank,
                this.state.isSelected);
              return {isSelected: !this.state.isSelected}
            }
          );
        }}/>;
    return (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            paddingStart: 10,
            paddingEnd: 10,
            paddingTop: 5,
            paddingBottom: 5,
            marginStart: 5,
            marginEnd: 5,
            marginTop: 10,
            marginBottom: 10
          }}>
          {check}
          <View style={{flex: 1}}/>
          <View>
            <Text
              style={{
                flex: 1,
                fontFamily: 'byekan',
                textAlign: 'center',
                color: '#6f67d9'
              }}>
              {this.props.item.item.rank}
            </Text>
            <Text
              style={{
                flex: 1,
                fontFamily: 'byekan',
                textAlign: 'center',
                color: '#6f67d9'
              }}>
              {this.props.item.item.first_name + " " +
              this.props.item.item.last_name}
            </Text>
          </View>
          <Image
            style={{
              width: 50,
              height: 50,
              margin: 10,
              borderWidth: 2,
              borderColor: '#00b',
              borderRadius: 25,
            }}
            tintColor={'#6f67d9'}
            source={require('../images/ic_no_profile.png')}/>
        </View>
        <View
          style={{
            width: '90%',
            height: 1,
            backgroundColor: '#c0c0c0'
          }}/>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(PeopleItem);
