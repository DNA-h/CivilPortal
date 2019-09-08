import React, {Component} from "react";
import {Dimensions, FlatList, Image, View, Text, SafeAreaView, TouchableWithoutFeedback} from 'react-native';
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import PeopleItem from "./Components/PeopleItem";
import Modal from "react-native-modal";
import {RequestsController} from "./Utils/RequestController";
import NavigationService from "./Service/NavigationService";

const {width} = Dimensions.get('window');

class ChoosePeople extends Component {

  constructor(props) {
    super(props);
    this.mIDs = [];
    this.state = {
      showDialog: false, showCongestion: false, sampleData: [], selectedData: []
    };
    this.me = {item: {rank: 'خودم', first_name: '', last_name: ''}};
    this._loadPeople = this._loadPeople.bind(this);
    this._itemClicked = this._itemClicked.bind(this);
    this._saveSession = this._saveSession.bind(this);
  }

  componentDidMount() {
    this._loadPeople();
  }

  async _loadPeople() {
    let names = await RequestsController.loadPeople();
    let mNames = names.لیست;
    this.setState({sampleData: mNames});
    let mme = await RequestsController.loadMyself();
    this.me = {
      item: {
        first_name: mme[0].fields.first_name,
        last_name: mme[0].fields.last_name,
        mobile: mme[0].fields.mobile,
        pic: 'http://185.211.57.73/static/uploads/' + mme[0].fields.image,
        rank: 'خودم'
      }
    };
    this.setState({selectedData: this.state.selectedData});
  }

  _toggleModal = () => {
    if (this.state.selectedData.length === 0) return;
    this.setState({showDialog: !this.state.showDialog});
  };

  _toggleCongestion = () => this.setState({showCongestion: !this.state.showCongestion});

  _itemClicked(first, last, mobile, rank, flag) {
    if (!flag) {
      this.state.selectedData.push({
        first_name: first, last_name: last, mobile: mobile, rank: rank
      });
      this.setState({selectedData: this.state.selectedData});
    } else {
      for (let index in this.state.selectedData) {
        if (this.state.selectedData[index][2] === mobile) {
          this.state.selectedData.splice(index, 1);
          break;
        }
      }
      this.setState({selectedData: this.state.selectedData});
    }
  }

  async _saveSession(force) {
    let json = await RequestsController.saveSession(this.props.navigation.getParam("date") + " " + this.props.navigation.getParam("start") + ":00", this.props.navigation.getParam("place"), this.props.navigation.getParam("date") + " " + this.props.navigation.getParam("end") + ":00", this.props.navigation.getParam("meeting_title"), force, this.state.selectedData);
    if (json.meeting_title !== undefined) NavigationService.navigate("MainPage"); else {
      this.congestion = json;
      this._toggleCongestion();
    }
  }

  render() {
    return (<SafeAreaView
        style={{
          flex: 1, backgroundColor: '#6b62d2',
        }}
      >
        <View
          style={{
            flex: 1, margin: 10, backgroundColor: '#FFFFFF', marginTop: 20, borderRadius: 25
          }}>
          <Text
            style={{
              color: '#6f67d9', textAlign: 'center', width: '100%', fontFamily: 'byekan', fontSize: 18, marginTop: 10
            }}>
            انتخاب نفرات
          </Text>
          <FlatList
            style={{
              flex: 1, marginBottom: 20
            }}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.sampleData}
            ListHeaderComponent={<PeopleItem
              showCheck={false}
              callback={() => {
              }}
              item={this.me} />}
            renderItem={(item) => <PeopleItem
              showCheck={true}
              callback={this._itemClicked}
              item={item} />}
          />
          <TouchableWithoutFeedback
            style={{
              marginVertical: 40, marginBottom: 10,
            }}
            onPress={this._toggleModal}>
            <View>
              <Text
                style={{
                  fontFamily: 'byekan',
                  fontSize: 18,
                  width: '80%',
                  textAlign: 'center',
                  color: '#6f67d9',
                  alignSelf: 'center',
                  borderRadius: 30,
                  marginBottom: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 25,
                }}>
                تایید و ثبت جلسه
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Modal
          isVisible={this.state.showDialog}
          onBackdropPress={this._toggleModal}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF", borderRadius: 25, marginStart: 10, marginEnd: 10, paddingStart: 10, paddingEnd: 10, paddingBottom: 5
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
                source={require("./images/ic_back.png")}
              />
              <Text
                style={{
                  flex: 1, textAlign: 'center', fontFamily: 'byekan', color: '#6f67d9'
                }}
              >
                تکمیل فرایند
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
                  source={require("./images/ic_question.png")}
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
                fontFamily: 'byekan', fontSize: 20, marginTop: 10, marginHorizontal: 20, marginVertical: 10, color: '#888'
              }}>
              شما {this.state.selectedData.length + 1} نفر را به جلسه دعوت کرده اید، آیا از دعوت آنها اطمینان دارید؟
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
                      fontFamily: 'byekan', fontSize: 17, color: "#e36c35", width: (width * 0.8) / 2, textAlign: 'center'
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
                  this._saveSession(0);
                  this._toggleModal();
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'byekan', fontSize: 17, color: "#7445e3", width: (width * 0.8) / 2, textAlign: 'center'
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
          onBackdropPress={this._toggleCongestion}>
          <View
            style={{
              backgroundColor: "#FFFFFF", borderRadius: 10, marginStart: 10, marginEnd: 10, paddingStart: 10, paddingEnd: 10, paddingBottom: 5
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
                source={require("./images/ic_back.png")}
              />
              <Text
                style={{
                  flex: 1, textAlign: 'center', fontFamily: 'byekan', color: '#6f67d9'
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
                  source={require("./images/ic_question.png")}
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
                fontFamily: 'byekan', marginHorizontal: 20, fontSize: 18, marginTop: 10, textAlign: 'center'
              }}>
              کابر گرامی تعدادی از کارمندان یا پرسنل شما در این بازه زمانی زمانی در جلسه دیگری حضور دارند و امکان دارد
              در این جلسه حضور پیدا نکنند. مایل به ادامه دادن هستید؟
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
                onPress={this._toggleCongestion}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'byekan', fontSize: 17, color: "#e36c35", width: (width * 0.8) / 2, textAlign: 'center'
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
                  this._saveSession(1);
                  this._toggleCongestion();
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'byekan', fontSize: 17, color: "#7445e3", width: (width * 0.8) / 2, textAlign: 'center'
                    }}>
                    بله
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>

      </SafeAreaView>);
  }
}

function mapStateToProps(state) {
  return {
    counter: state
  }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(ChoosePeople);
