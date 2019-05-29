import React, {Component} from "react";
import {FlatList, View, Text, Button, TouchableWithoutFeedback} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import NavigationService from "./Service/NavigationService";
import MapView from 'react-native-maps';
import PeopleItem from "./Components/PeopleItem";
import Modal from "react-native-modal";
import {ConnectionManager} from "./Utils/ConnectionManager";
import {RequestsController} from "./Utils/RequestController";

class ChoosePeople extends Component {

    constructor(props) {
        super(props);
        this.mIDs = [];
        this.state = {
            showDialog: false,
            sampleData: [{rank: 'design', name: 'naser', showCheck: true}]
        };
        this._loadPeople = this._loadPeople.bind(this);
        this._itemClicked = this._itemClicked.bind(this);

    }

    componentDidMount() {
        this._loadPeople();
    }

    async _loadPeople() {
        let names = await RequestsController.loadPeople();
        this.setState({sampleData: names});
    }

    _toggleModal = () =>
        this.setState({showDialog: !this.state.showDialog});

    _findPeopleFromId(id) {
        for (let j = 0; j < this.state.sampleData.length; j++) {
            if (this.state.sampleData[j].id === id) {
                return j;
            }
        }
        return -1;
    }

    _itemClicked(id, flag) {
        let index = this._findPeopleFromId(id);
        this.state.sampleData[index].flag = !flag;
    }

    render() {
        return (
            <Wallpaper>
                <View
                    style={{
                        flex: 1
                    }}>
                    <Text>
                        انتخاب نفرات
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
                                showCheck={true}
                                callback={this._itemClicked}
                                item={item}/>}
                    />
                </View>
                <Modal isVisible={this.state.showDialog}
                       onBackdropPress={this._toggleModal}>
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
                            آیا از ایجاد جلسه جدید مطمئن هستید؟
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
                                    this._saveSession();
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
                <TouchableWithoutFeedback
                    style={{
                        marginVertical: 40,
                        marginBottom: 40,
                    }}
                    onPress={this._toggleModal}>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                width: '80%',
                                textAlign: 'center',
                                color: '#FFFFFF',
                                alignSelf: 'center',
                                backgroundColor: '#F035E0',
                                borderRadius: 30,
                                marginBottom: 40,
                                paddingVertical: 10,
                                paddingHorizontal: 25,
                            }}>
                            ثبت جلسه
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

            </Wallpaper>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(ChoosePeople);
