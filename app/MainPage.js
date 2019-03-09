import React, {Component} from "react";
import {Text, View, FlatList, Image, TouchableWithoutFeedback, Button} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions";
import CalendarItem from "./Components/CalendarItem";
import ActionButton from 'react-native-action-button';
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import {createDrawerNavigator, DrawerItems, DrawerActions} from "react-navigation";
import AddNewSession from "./AddNewSession";
import CalendarPage from "./CalendarPage";
import {ConnectionManager} from "./Utils/ConnectionManager";
import DBManager from "./Utils/DBManager";
import Modal from "react-native-modal";

let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let gMonths = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه",
    "اوت", "سپتامبر", "اوکتبر", "نوامبر", "دسامبر"];
let arabicNumbers = ['۰', '۱', '٢', '٣', '۴', '۵', '۶', '۷', '٨', '٩'];
let names = [];

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.difference = 0;
        this.state = {
            todayPersian: '___',
            monthPersian: '    ',
            todayGeorgian: '___',
            todayHijri: '___',
            sampleData: [],
            isLoading: true,
            showDialog: false,
            currIndex: 0
        };
        this._dayPressed = this._dayPressed.bind(this);
        this._init = this._init.bind(this);
        this.parseGeorgianDate = this.parseGeorgianDate.bind(this);
        this.parseHijriDate = this.parseHijriDate.bind(this);
        this.parsePersianDate = this.parsePersianDate.bind(this);
        this._loadSessions = this._loadSessions.bind(this);
        this._init = this._init.bind(this);
        this._toggleModal = this._toggleModal.bind(this);
        this._loadPeople = this._loadPeople.bind(this);
        this._init();
        this._loadPeople();
    }

    async _loadPeople() {
        let result = await ConnectionManager.getPeople();
        for (let index in result) {
            let item = {name: result[index].category_name, place: result[index].category_id};
            names.push(item);
        }
    }

    async _loadSessions() {
        let jalaali = require('jalaali-js');
        let date = new Date();
        date.setDate(date.getDate() + this.difference);
        let jalali = jalaali.toJalaali(date);
        let session_id = -1;
        let value = jalali.jy + "/" + (jalali.jm < 10 ? '0' + jalali.jm : jalali.jm) + "/" +
            (jalali.jd < 10 ? '0' + jalali.jd : jalali.jd);
        let result = await ConnectionManager.loadSessions(value);
        for (let index in result) {
            if (result[index].session_id === session_id) {
                this.state.sampleData[this.state.sampleData.length - 1].people.push({id: parseInt(result[index].child_id)});
                continue;
            }
            session_id = result[index].session_id;
            let item = {
                start: result[index].star_time,
                end: result[index].end_time,
                title: result[index].desc_visit,
                location: result[index].location_visit,
                index: this.state.sampleData.length,
                people: [{id: parseInt(result[index].child_id)}]
            };
            this.state.sampleData.push(item);
        }
        // console.log('sampleData', this.state);
        this.setState({sampleData: this.state.sampleData, isLoading: false});
    }

    componentDidMount() {
        this._checkToken();
    }

    async _checkToken() {
        let token = await DBManager.getSettingValue('token');
        if (token !== undefined && token !== null && token.toString().length === 10) {
            SplashScreen.hide();
        } else {
            SplashScreen.hide();
            NavigationService.navigate('Login', null);
        }
    }

    _init() {
        let a = this.parsePersianDate();
        let b = this.parseGeorgianDate();
        let c = this.parseHijriDate();
        let d = this.parsePersianMonth();
        this.state.todayPersian = a;
        this.state.todayGeorgian = b;
        this.state.todayHijri = c;
        this.state.monthPersian = d;
        this.setState({
            todayPersian: this.state.todayPersian,
            todayGeorgian: this.state.todayGeorgian,
            todayHijri: this.state.todayHijri,
            monthPersian: this.state.monthPersian,
            isLoading: true
        });
        this._loadSessions();
    }

    parsePersianDate() {
        let jalaali = require('jalaali-js');
        let date = new Date();
        date.setDate(date.getDate() + this.difference);
        let jalali = jalaali.toJalaali(date);
        let value = jalali.jd + '';
        let chars = value.split('');
        for (let index in chars)
            if (chars[index] >= '0' && chars[index] <= '9')
                chars[index] = arabicNumbers[chars[index] - '0'];
        return chars.join('');
    }

    parsePersianMonth() {
        let jalaali = require('jalaali-js');
        let date = new Date();
        date.setDate(date.getDate() + this.difference);
        let jalali = jalaali.toJalaali(date);
        return months[jalali.jm - 1];
    }

    parseGeorgianDate() {
        let date = new Date();
        date.setDate(date.getDate() + this.difference);
        let value = date.getDate() + " " + gMonths[date.getMonth()] + "\n" + date.getFullYear();
        let chars = value.split('');
        for (let index in chars)
            if (chars[index] >= '0' && chars[index] <= '9')
                chars[index] = arabicNumbers[chars[index] - '0'];
        return chars.join('');
    }

    parseHijriDate() {
        let hijri = require('hijri');
        let date = hijri.convert(new Date(), this.difference);
        let value = date.dayOfMonth + " " + date.monthText + "\n" + date.year;
        let chars = value.split('');
        for (let index in chars)
            if (chars[index] >= '0' && chars[index] <= '9')
                chars[index] = arabicNumbers[chars[index] - '0'];
        return chars.join('');
    }

    _dayPressed(flag) {
        this.difference += flag ? -1 : 1;
        this.setState({
            todayPersian: this.parsePersianDate(),
            todayGeorgian: this.parseGeorgianDate(),
            todayHijri: this.parseHijriDate(),
            sampleData: [],
            isLoading: true
        });
        this._loadSessions();
    }

    _toggleModal(index) {
        this.setState({showDialog: !this.state.showDialog, currIndex: index});
    }

    render() {
        let location = this.state.showDialog > 0 ? this.state.sampleData[this.state.currIndex].location : '';
        let title = this.state.showDialog > 0 ? this.state.sampleData[this.state.currIndex].title : '';
        let time = this.state.showDialog > 0 ?
            ('از ' + this.state.sampleData[this.state.currIndex].start + ' تا '
                + this.state.sampleData[this.state.currIndex].end) : '';
        let people = '\n';
        if (this.state.showDialog) {
            for (let index in this.state.sampleData[this.state.currIndex].people)
                people = people + names[this.state.sampleData[this.state.currIndex].people[index].id].name + '\n\n';
        }
        let warning = this.state.sampleData.length === 0 && !this.state.isLoading ?
            <Text
                style={{
                    flex: 1,
                    fontFamily: 'byekan',
                    textAlign: 'center'
                }}>
                هیچ برنامه برای امروز تعیین نشده است
            </Text> : <FlatList
                style={{
                    flex: 1,
                    height: '100%'
                }}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.sampleData}
                renderItem={(item) =>
                    <CalendarItem
                        item={item}
                        callback={this._toggleModal}/>}
            />;
        return (
            <Wallpaper>
                <View
                    style={{
                        flex: 2,
                        flexDirection: 'row',
                        backgroundColor: '#CCCCCCAA'
                    }}>
                    <View
                        style={{
                            flex: 2,
                            justifyContent: 'center'
                        }}>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 13,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            {this.state.todayHijri}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 13,
                                color: '#000000',
                                width: '100%',
                                textAlign: 'center',
                                paddingEnd: 10,
                                paddingStart: 10
                            }}>
                            {this.state.todayGeorgian}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 3
                        }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center'
                        }}>
                            <Text
                                style={{
                                    fontFamily: 'byekna',
                                    fontSize: 45,
                                    fontWeight: 'bold',
                                    color: '#000000',
                                    width: '100%',
                                    textAlign: 'center',
                                    paddingEnd: 10,
                                    paddingStart: 10
                                }}>
                                {this.state.todayPersian}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'byekan',
                                    fontSize: 18,
                                    color: '#000000',
                                    width: '100%',
                                    textAlign: 'center',
                                    paddingEnd: 10,
                                    paddingStart: 10
                                }}>
                                {this.state.monthPersian}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end'
                        }}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    margin: 10
                                }}
                                source={require("./images/nav_icon.png")}/>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View
                    style={{
                        height: 1,
                        width: '100%'
                    }}/>
                <View
                    style={{
                        flex: 9,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <TouchableWithoutFeedback
                        onPress={() => this._dayPressed(true)}>
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                                marginLeft: 10
                            }}
                            tintColor={"#6393ff"}
                            source={require("./images/ic_back.png")}/>
                    </TouchableWithoutFeedback>
                    {warning}
                    <TouchableWithoutFeedback
                        onPress={() => this._dayPressed(false)}>
                        <Image
                            style={{width: 20, height: 20, marginRight: 10}}
                            tintColor={"#6393ff"}
                            transform={[{rotateY: '180deg'}]}
                            source={require("./images/ic_back.png")}/>
                    </TouchableWithoutFeedback>
                </View>
                <ActionButton
                    buttonColor="rgba(231,76,60,1)"
                    onPress={() => NavigationService.navigate('AddNewSession', null)}>
                </ActionButton>
                <Modal
                    isVisible={this.state.showDialog}
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
                                fontFamily: 'byekan',
                                fontSize: 18,
                                marginTop: 10,
                                color: '#000',
                                width: '100%',
                                textAlign: 'center'
                            }}>
                            خلاصه ای از جلسه
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                marginTop: 10
                            }}>
                            عنوان جلسه: {title}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                marginTop: 10
                            }}>
                            مکان جلسه: {location}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                marginTop: 10
                            }}>
                            ساعت جلسه: {time}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                marginTop: 10
                            }}>
                            افراد حاضر در جلسه جلسه:
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                fontSize: 18,
                                marginTop: 10,
                                width: '100%',
                                color: '#000000',
                                textAlign: 'center'
                            }}>
                            {people.toString()}
                        </Text>
                    </View>
                </Modal>
            </Wallpaper>
        );
    }
}

class MyNotificationsScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Notifications',
        drawerIcon: ({tintColor}) => (
            <Image
                source={require('./images/nav_icon.png')}
                style={{tintColor: tintColor, width: 24, height: 24}}
            />
        ),
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back home"
            />
        );
    }
}

const MyDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: MainPage,
        navigationOptions: ({navigation}) => ({
            title: 'صفحه اصلی',
        }),
    },
    AddNewSession: {
        screen: AddNewSession,
        navigationOptions: ({navigation}) => ({
            title: 'ثبت جلسه جدید',
        }),
    },
    CalendarPage: {
        screen: CalendarPage,
        navigationOptions: ({navigation}) => ({
            title: 'مشاهده تقویم من',
        }),
    },
}, {
    contentComponent: (props) => (
        <View>
            <DrawerItems {...props} />
        </View>
    ),
    drawerPosition: 'right'
});

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(MyDrawerNavigator);
