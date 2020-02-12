import React, {Component} from "react";
import {
  FlatList, View, Text,
  TouchableWithoutFeedback, Image, Dimensions, TouchableOpacity
} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../actions";
import PeopleItem from "./Components/PeopleItem";
import Modal from "react-native-modal";
import {RequestsController} from "../Utils/RequestController";
import NavigationService from "../service/NavigationService";

const {width} = Dimensions.get('window');

class ShareSession extends Component {

  constructor(props) {
    super(props);
    this.mIDs = [];
    this.state = {
      showDialog: false,
      showCongestion: false,
      peoples: []
    };
    this.replaced = undefined;
    this.replacedName = undefined;
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
    this.setState({peoples: names});
  }

  _toggleModal = () =>
    this.setState({showDialog: !this.state.showDialog});

  _toggleCongestion = () =>
    this.setState({showCongestion: !this.state.showCongestion});

  _itemClicked(first, last, pk) {
    this.replaced = pk;
    this.replacedName = first + " " + last;
    this._toggleModal();
  }

  async _shareSession(force) {
    let json = await RequestsController.shareSession(
      this.props.navigation.getParam("session_id"),
      this.replaced,
      force
    );
    if (json.length === 1)
      NavigationService.navigate("MainPage");
    else
      this.setState({
        showDialog: false,
        showCongestion: true,
      })
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
            backgroundColor: '#FFFFFF',
            marginVertical: 80,
            marginHorizontal:20,
            borderRadius: 60
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              paddingHorizontal: 10
            }}
          >
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={NavigationService.goBack}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 15,
                  tintColor: '#6f67d9'
                }}
                source={require("../images/ic_back.png")}
              />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'IRANSansMobile',
                fontSize: 18,
                color: '#6f67d9'
              }}
            >
              واگذاری جلسه
            </Text>
            <View
              style={{
                borderColor: '#6f67d9',
                height: 20,
                width: 20,
                borderRadius: 16,
                marginRight: 30,
              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  tintColor: '#6f67d9'
                }}
                source={require("../images/ic_no_profile.png")}
              />
            </View>
          </View>
          <FlatList
            style={{
              flex: 1,
              marginBottom: 20
            }}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.peoples}
            renderItem={(item) =>
              <PeopleItem
                showCheck={false}
                share={true}
                callback={this._itemClicked}
                item={item}
              />
            }
          />
        </View>
        <Modal
          isVisible={this.state.showDialog}
          onBackdropPress={this._toggleModal}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 25,
              marginStart: 10,
              marginEnd: 10,
              paddingStart: 10,
              paddingEnd: 10,
              paddingBottom: 5
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 15
              }}
            >
              <Image
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 30,
                  tintColor: '#6f67d9'
                }}
                source={require("../images/ic_back.png")}
              />
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: 'IRANSansMobile',
                  fontSize: 20,
                  color: '#6f67d9'
                }}
              >
                تکمیل فرایند
              </Text>
              <View
                style={{
                  borderColor: '#6f67d9',
                  borderWidth: 2,
                  height: 20,
                  width: 20,
                  borderRadius: 16,
                  marginRight: 30,
                }}
              >
                <Image
                  style={{
                    height: 16,
                    width: 16,
                    tintColor: '#6f67d9'
                  }}
                  source={require("../images/ic_question.png")}
                />
              </View>
            </View>
            <View
              style={{
                height: 1, width: '90%', alignSelf: 'center', marginTop: 5, backgroundColor: '#CCC'
              }}
            />
            <Text
              style={{
                fontFamily: 'IRANSansMobile',
                fontSize: 20,
                marginHorizontal: 20,
                marginVertical: 20,
                color: '#888',
                textAlign: 'center'
              }}>
              آیا مایل هستید جناب {this.replacedName} به عنوان جایگزین شما در جلسه شرکت نماید؟
            </Text>
            <View
              style={{
                height: 1, width: '90%', alignSelf: 'center', marginTop: 5, backgroundColor: '#CCC'
              }}
            />
            <View
              style={{
                flexDirection: 'row', height: 40, alignItems: 'center', width: width * 0.9
              }}>
              <TouchableWithoutFeedback
                onPress={this._toggleModal}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'IRANSansMobile',
                      fontSize: 25,
                      color: "#e36c35",
                      width: (width * 0.8) / 2,
                      textAlign: 'center'
                    }}>
                    خیر
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  height: 40, width: 1, marginTop: 2, backgroundColor: '#CCC'
                }}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  this._shareSession(0);
                  this._toggleModal();
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'IRANSansMobile',
                      fontSize: 25,
                      color: "#7445e3",
                      width: (width * 0.8) / 2,
                      textAlign: 'center'
                    }}>
                    بله
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.showCongestion}
          onBackdropPress={() => this.setState({showCongestion: false})}>
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
            <View
              style={{
                flexDirection: 'row', marginTop: 10
              }}
            >
              <Image
                style={{
                  height: 20, width: 20, marginLeft: 10, tintColor: '#6f67d9'
                }}
                source={require("../images/ic_back.png")}
              />
              <Text
                style={{
                  flex: 1, textAlign: 'center', fontFamily: 'IRANSansMobile', color: '#6f67d9'
                }}
              >
                وجود تداخل
              </Text>
              <View
                style={{
                  borderColor: '#6f67d9', borderWidth: 2, borderRadius: 12, marginRight: 10,
                }}
              >
                <Image
                  style={{
                    height: 20, width: 20, tintColor: '#6f67d9'
                  }}
                  source={require("../images/ic_question.png")}
                />
              </View>
            </View>
            <View
              style={{
                height: 1, width: '90%', alignSelf: 'center', marginTop: 5, backgroundColor: '#CCC'
              }}
            />
            <Text
              style={{
                fontFamily: 'IRANSansMobile', marginHorizontal: 20, fontSize: 18, marginTop: 10, textAlign: 'center'
              }}>
              کابر گرامی کارمند یا پرسنل شما در این بازه زمانی زمانی در جلسه دیگری حضور دارد و امکان دارد
              در این جلسه حضور پیدا نکند. مایل به ادامه دادن هستید؟
            </Text>
            <View
              style={{
                height: 1, width: '90%', alignSelf: 'center', marginTop: 5, backgroundColor: '#CCC'
              }}
            />
            <View
              style={{
                flexDirection: 'row', height: 40, alignItems: 'center', width: width * 0.9
              }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({showCongestion: false})}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'IRANSansMobile',
                      fontSize: 17,
                      color: "#e36c35",
                      width: (width * 0.8) / 2,
                      textAlign: 'center'
                    }}>
                    خیر
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  height: 40, width: 1, marginTop: 2, backgroundColor: '#CCC'
                }}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  this._shareSession(1);
                  this.setState({showCongestion: false});
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'IRANSansMobile',
                      fontSize: 17,
                      color: "#7445e3",
                      width: (width * 0.8) / 2,
                      textAlign: 'center'
                    }}>
                    بله
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
