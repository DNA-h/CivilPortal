import React, {Component} from "react";
import {Text, View, Image, TouchableWithoutFeedback} from 'react-native';
import {CheckBox} from 'react-native-elements'
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../../actions";
import Globals from "../../Utils/Globals";
import DBManager from "../../Utils/DBManager";

class PeopleItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };
  }

  handlePress = () => {
    if (!this.props.showCheck)
      this.props.callback(this.props.item.item.first_name,
        this.props.item.item.last_name,
        this.props.item.item.id);
    else {
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
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.handlePress}
      >
        <View
          style={{alignItems: 'center', width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {
              this.props.share ? null :
                <CheckBox
                  checked={this.props.showCheck ? this.state.isSelected : true}
                  onPress={this.handlePress}
                  disabled={!this.props.showCheck}
                  checkedIcon={'square'}
                />
            }
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: DBManager.RFHeight(2.3),
                  textAlign: 'center',
                  color: '#6f67d9'
                }}
              >
                {
                  this.props.item.item.first_name + " " +
                  this.props.item.item.last_name
                }
              </Text>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: DBManager.RFHeight(2.2),
                  textAlign: 'center',
                  color: '#7e7e7e',
                  backgroundColor: '#dddddd',
                  borderRadius: 15,
                  paddingVertical: 4
                }}
              >
                {this.props.item.item.rank === 'خودم' ? 'خودم' : this.props.item.item.rank_name}
              </Text>
            </View>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: Globals.PRIMARY_DARK_BLUE,
                margin: 10,
              }}
            >
              <Image
                style={{
                  width: 54,
                  height: 54,
                  resizeMode: 'cover',
                }}
                source={{uri: this.props.item.item.pic}}
              />
            </View>
          </View>
          <View
            style={{
              width: '90%',
              height: 1,
              backgroundColor: this.props.item.item.rank === 'خودم' ? '#6f67d9' : '#c0c0c0'
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(PeopleItem);
