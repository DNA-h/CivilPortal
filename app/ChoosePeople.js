import React, {Component} from "react";
import {FlatList, View, Text, Button, TouchableWithoutFeedback} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import ActionButton from 'react-native-action-button';
import ButtonSubmit from "./Components/ButtonSubmit";
import PersianDatePicker from 'react-native-persian-date-picker';
import NavigationService from "./Service/NavigationService";
import MapView from 'react-native-maps';
import SplashScreen from 'react-native-splash-screen';
import CalendarItem from "./Components/CalendarItem";
import PeopleItem from "./Components/PeopleItem";
import Modal from "react-native-modal";
import {ConnectionManager} from "./Utils/ConnectionManager";

class ChoosePeople extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            sampleData: []
        };
        this._loadPeople = this._loadPeople.bind(this);
        this._loadPeople();
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    async _loadPeople() {
        let result = await ConnectionManager.getPeople();
        for (let index in result) {
            let item = {name: result[index].category_name, place: result[index].category_id};
            this.state.sampleData.push(item);
        }
        this.setState({sampleData: this.state.sampleData});
    }

    _toggleModal = () =>
        this.setState({showDialog: !this.state.showDialog});

    render() {
        return (
            <Wallpaper>
                <View
                    style={{
                        flex: 1
                    }}>
                    <FlatList
                        style={{
                            flex: 1
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.sampleData}
                        renderItem={(item) =>
                            <PeopleItem
                                showCheck = {true}
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
                <Button
                    title="بعدی"
                    onPress={() => this._toggleModal()}/>

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
