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
        const str = this.props.item.item.pic !== undefined ? this.props.item.item.pic : '';
        // console.log('str ', typeof str);
    return (
      <View
        style={{alignItems: 'center'}}>
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
              {this.props.item.item.rank_name}
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
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius:25,
              overflow:'hidden',
              borderWidth: 2,
              borderColor: '#00b',
              margin: 10,
            }}
          >
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: 'contain',
            }}
            source={{uri:`http://185.211.57.73/${str.replace('http://127.0.0.1:8001/','')}`}}/>
          </View>
        </View>
        <View
          style={{
            width: '90%',
            height: 1,
            backgroundColor: this.props.item.item.rank === 'خودم' ? '#6f67d9' : '#c0c0c0'
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
