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

let Parse = require('parse/react-native');

class ChoosePeople extends Component {

    constructor(props) {
        super(props);
        this.mIDs = [];
        this.state = {
            showDialog: false,
            sampleData: []
        };
        this._loadPeople = this._loadPeople.bind(this);
        this._itemClicked = this._itemClicked.bind(this);
        this._saveSession = this._saveSession.bind(this);

    }

    componentDidMount() {
        this._loadPeople();
    }

    async _loadPeople() {
        let names = await ConnectionManager.getPeople();
        this.setState({sampleData: names});
    }

    async _saveSession() {
        let people = "";
        for (let index in this.mIDs) {
            if (this.mIDs[index].flag)
                if (people === "")
                    people = people + "" + (parseInt(index.toString()) + 1);
                else
                    people = people + "," + (parseInt(index.toString()) + 1);
        }
        const Sessions = Parse.Object.extend("Sessions");
        const session = new Sessions();

        session.set("start", this.props.navigation.getParam('start'));
        session.set("end", this.props.navigation.getParam('end'));
        session.set("date", this.props.navigation.getParam('date'));
        session.set("title", this.props.navigation.getParam('title'));
        session.set("location", 'Eo1in0m2NK');
        session.set("owner", 'HepRlBVObH');

        session.save().then((nazr) => {
            console.log("object created ", nazr.id);
            let ID = nazr.id;
            for (let index in this.state.sampleData){
                if (this.state.sampleData[index].flag){
                    const SessionPeople = Parse.Object.extend("SessionPeople");
                    const session = new SessionPeople();

                    session.set("session_id", ID);
                    session.set("people_id", this.state.sampleData[index].id);
                    session.set("replace_id", "0");

                    session.save().then((nazr) => {
                        console.log("object created ", nazr.id);
                    }, (error) => {
                        console.log("error: ", error.message);
                    });
                }
            }
            NavigationService.reset('MainPage');
        }, (error) => {
            console.log("error: ", error.message);
        });

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
