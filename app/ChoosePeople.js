import React, {Component} from "react";
import {FlatList, View, Text, Button, TouchableWithoutFeedback, Image, CheckBox} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import PeopleItem from "./Components/PeopleItem";
import Modal from "react-native-modal";
import {RequestsController} from "./Utils/RequestController";
import NavigationService from "./Service/NavigationService";

class ChoosePeople extends Component {

    constructor(props) {
        super(props);
        this.mIDs = [];
        this.state = {
            showDialog: false,
            showCongestion: false,
            sampleData: [],
            selectedData: []
        };
        this._loadPeople = this._loadPeople.bind(this);
        this._itemClicked = this._itemClicked.bind(this);
        this._saveSession = this._saveSession.bind(this);
    }

    componentDidMount() {
        this._loadPeople();
    }

    async _loadPeople() {
        let names = await RequestsController.loadPeople();
        this.setState({sampleData: names});
        let me = await RequestsController.loadMyself();
        this.state.selectedData.push(me[0]);
        this.setState({selectedData: this.state.selectedData});
    }

    _toggleModal = () =>
        this.setState({showDialog: !this.state.showDialog});

    _toggleCongestion = () =>
        this.setState({showCongestion: !this.state.showCongestion});

    _findPeopleFromId(id) {
        for (let j = 0; j < this.state.sampleData.length; j++) {
            if (this.state.sampleData[j].id === id) {
                return j;
            }
        }
        return -1;
    }

    _itemClicked(first, last, mobile, pk, flag) {
        if (!flag) {
            this.state.selectedData.push({
                pk: pk,
                fields: {
                    first_name: first,
                    last_name: last,
                    mobile: mobile,
                }
            });
            this.setState({selectedData: this.state.selectedData});
        } else {
            for (let index in this.state.selectedData) {
                if (this.state.selectedData[index].pk === pk) {
                    this.state.selectedData.splice(index, 1);
                    break;
                }
            }
            this.setState({selectedData: this.state.selectedData});
        }
    }

    async _saveSession() {
        let json = await RequestsController.saveSession(
            this.props.navigation.getParam("date") + " " +
            this.props.navigation.getParam("start") + ":0+0000",
            this.props.navigation.getParam("place"),
            this.props.navigation.getParam("date") + " " +
            this.props.navigation.getParam("end") + ":0+0000",
            this.props.navigation.getParam("meeting_title"),
            this.state.selectedData
        );
        if (json.meeting_title !== undefined)
            NavigationService.navigate("MainPage");
        else {
            this.congestion = json;
            this._toggleCongestion();
        }
        console.log('json is ', json);
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
                        data={this.state.selectedData}
                        renderItem={(item) =>
                            <PeopleItem
                                showCheck={true}
                                callback={this._itemClicked}
                                item={item}/>}
                    />
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
                            شما در حال اضافه کردن {this.state.selectedData.length} نفر هستید
                            {"\n"}
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
