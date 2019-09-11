import React, {Component} from "react";
import {FlatList, View, Text, Button, TouchableWithoutFeedback, Image, CheckBox} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../actions";
import PeopleItem from "./Components/PeopleItem";
import Modal from "react-native-modal";
import {RequestsController} from "../Utils/RequestController";
import NavigationService from "../service/NavigationService";

class ShareSession extends Component {

  constructor(props) {
    super(props);
    this.mIDs = [];
    this.state = {
      showDialog: false,
      showCongestion: false,
      sampleData: []
    };
    this.replaced = undefined;
    this.replacedName =undefined;
    this._loadPeople = this._loadPeople.bind(this);
    this._itemClicked = this._itemClicked.bind(this);
    this._shareSession = this._shareSession.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props.navigation);
    this._loadPeople();
  }

  async _loadPeople() {
    let names = await RequestsController.loadPeople();
    let mNames = names.لیست;
    this.setState({sampleData: mNames});
  }

  _toggleModal = () =>
    this.setState({showDialog: !this.state.showDialog});

  _toggleCongestion = () =>
    this.setState({showCongestion: !this.state.showCongestion});

  _itemClicked(first, last, pk) {
    this.replaced = pk;
    this.replacedName = last + " " + first;
    this._toggleModal();
  }

  async _shareSession() {
    let json = await RequestsController.shareSession(
      this.props.navigation.getParam("session_id"),
      this.replaced
    );
    // if (json.meeting_title !== undefined)
      NavigationService.navigate("MainPage");
    // else {
    //   this.congestion = json;
    //   this._toggleCongestion();
    // }
    console.log('json is ', json);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#6b62d2',
        }}
      >
        <View
          style={{
            flex: 1,
            margin: 10,
            backgroundColor: '#FFFFFF',
            marginTop: 20,
            borderRadius: 25
          }}>
          <Text
            style={{
              color: '#6f67d9',
              textAlign: 'center',
              width: '100%',
              fontFamily: 'byekan',
              fontSize: 18,
              marginTop: 10
            }}>
            واگذاری جلسه
          </Text>
          <FlatList
            style={{
              flex: 1,
              marginBottom: 20
            }}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.sampleData}
            renderItem={(item) =>
              <PeopleItem
                showCheck={false}
                share={true}
                callback={this._itemClicked}
                item={item}/>}
          />
        </View>
        <Modal
          isVisible={this.state.showDialog}
          onBackdropPress={this._toggleModal}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              marginStart: 10,
              marginEnd: 10,
              paddingStart: 10,
              paddingEnd: 10,
              paddingBottom: 5
            }}>
            <Text
              style={{
                fontFamily: 'IRANSansMobile',
                fontSize: 18,
                marginTop: 10
              }}>
              آیا مایل  جناب {this.replacedName} به عنوان جایگزین شما در جلسه شرکت نماید؟
            </Text>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                justifyContent: 'space-between',
                paddingEnd: 25,
                paddingStart: 25
              }}>
              <TouchableWithoutFeedback
                onPress={this._toggleModal}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'IRANSansMobile',
                      paddingEnd: 15,
                      paddingStart: 15,
                      marginTop: 5,
                      marginBottom: 5,
                      fontSize: 17,
                      color: "#50E3C2",
                      borderWidth: 1,
                      borderColor: "#50E3C2",
                      borderRadius: 10,
                      marginStart: 15,
                      marginEnd: 15
                    }}>
                    خیر
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  this._shareSession();
                  this._toggleModal();
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'IRANSansMobile',
                      paddingEnd: 15,
                      paddingStart: 15,
                      marginTop: 5,
                      marginBottom: 5,
                      fontSize: 17,
                      color: "#D0021B",
                      borderWidth: 1,
                      borderColor: "#D0021B",
                      borderRadius: 10,
                      marginStart: 15,
                      marginEnd: 15
                    }}>
                    بله
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.showCongestion}
               onBackdropPress={this._toggleCongestion}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              marginStart: 10,
              marginEnd: 10,
              paddingStart: 10,
              paddingEnd: 10,
              paddingBottom: 5
            }}>
            <Text
              style={{
                fontFamily: 'IRANSansMobile',
                fontSize: 18,
                marginTop: 10
              }}>
              متاسفانه در هنگام ایجاد جلسه خطایی رخ داد
              {"\n"}
              {this.congestion}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                justifyContent: 'space-between',
                paddingEnd: 25,
                paddingStart: 25
              }}>
              <TouchableWithoutFeedback
                onPress={this._toggleCongestion}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'IRANSansMobile',
                      paddingEnd: 15,
                      paddingStart: 15,
                      marginTop: 5,
                      marginBottom: 5,
                      fontSize: 17,
                      color: "#50E3C2",
                      borderWidth: 1,
                      borderColor: "#50E3C2",
                      borderRadius: 10,
                      marginStart: 15,
                      marginEnd: 15
                    }}>
                    متوجه شدم
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(ShareSession);
