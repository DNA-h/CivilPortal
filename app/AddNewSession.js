import React, {Component} from "react";
import {
    StyleSheet, View, Image,
    TouchableWithoutFeedback, Text, Picker,
    ScrollView, Keyboard, Dimensions, TextInput
} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import NavigationService from "./Service/NavigationService";
import Item from "./Components/Item";
import SplashScreen from "react-native-splash-screen";
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import {RequestsController} from "./Utils/RequestController";

MapboxGL.setAccessToken("pk.eyJ1IjoiZG5hLWgiLCJhIjoiY2p2eGN3ZG1lMDNpcTQ0cnpvMHBobm5ubSJ9.anMU_gz8N2Hl7H0oTgtINg");

let dailyHour = ['00', '01', '02', '03',
    '04', '05', '06', '07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23'];
let dailyMinutes = ['00', '15', '30', '45'];
let monthsDays = ['01', '02', '03',
    '04', '05', '06', '07', '08', '09', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
let months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
let days = ['دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه', 'یکشنبه'];
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddNewSession extends Component {

    constructor(props) {
        super(props);
        this.myRef = 1;
        let jalaali = require('jalaali-js');
        let date = new Date();
        let jalali = jalaali.toJalaali(date);
        let month = jalali.jm - 1;
        let day = jalali.jd - 1;
        this.data = [];
        for (let i = 0; i < 31; i++) {
            let jalali = jalaali.toJalaali(date);
            let month = jalali.jm - 1;
            let day = jalali.jd;
            let d = date.getDay();
            this.data.push({
                index: i,
                date: day,
                month: months[month],
                day: days[d]
            });
            date.setDate(date.getDate() + 1);
        }
        this.state = {
            selectedDay: day,
            selectedMonth: month,
            currentItem: 0,
            currentPercent: 0.1,
            selectedHour: 5,
            selectedMinute: 5,
            currentPlace: -1,
            places: []
        };
        this.handleScroll = this.handleScroll.bind(this);
        this._loadPlaces = this._loadPlaces.bind(this);
    }

    handleScroll(event: Object) {
        let x = event.nativeEvent.contentOffset.x;
        let index = Math.floor(x / 70);
        let percent = (x % 70) / 70;
        this.setState({
            currentItem: index,
            currentPercent: percent
        });
    }

    componentDidMount() {
        SplashScreen.hide();
        this._loadPlaces();
    }

    async _loadPlaces() {
        let result = await RequestsController.MyPlaces();
        for (let index in result) {
            let item = {
                pk: result[index].pk, title: result[index].fields.place_title
            };
            this.state.places.push(item);
        }
        this.setState({places: this.state.places});
    }

    render() {
        return (
            <View
                style={{flex: 1, backgroundColor: '#78a4ff'}}>
                <View
                    style={{
                        flex: 1,
                        width: DEVICE_WIDTH,
                        height: DEVICE_HEIGHT,
                    }}>
                    <View
                        style={{
                            alignItems: 'center',
                            flex: 1
                        }}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                            <ScrollView
                                onScroll={this.handleScroll}
                                horizontal={true}
                                style={{width: '100%'}}>
                                <View style={{width: DEVICE_WIDTH / 2}}/>
                                {this.data.map(
                                    (key, index) =>
                                        <Item
                                            index={key.index}
                                            currentItem={this.state.currentItem}
                                            currentPercent={this.state.currentPercent}
                                            date={key.date}
                                            month={key.month}
                                            day={key.day}/>
                                )}
                                <View style={{width: DEVICE_WIDTH / 2}}/>
                            </ScrollView>
                        </View>
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1
                        }}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <View style={{flex: 1}}/>
                            <View>
                                <TouchableWithoutFeedback
                                    onPress={() => this.setState(
                                        {selectedHour: Math.min(23, this.state.selectedHour + 1)})}>
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25,
                                            transform: [{rotate: '90deg'}]
                                        }}
                                        source={require("./images/ic_back.png")}/>
                                </TouchableWithoutFeedback>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: 'byekan',
                                        backgroundColor: 'white',
                                        borderRadius: 12,
                                        textAlign: 'center'
                                    }}>
                                    {this.state.selectedHour}
                                </Text>
                                <TouchableWithoutFeedback
                                    onPress={() => this.setState(
                                        {selectedHour: Math.max(0, this.state.selectedHour - 1)})}>
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25,
                                            transform: [{rotate: '-90deg'}]
                                        }}
                                        source={require("./images/ic_back.png")}/>
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={{marginHorizontal: 10}}>:</Text>
                            <View>
                                <TouchableWithoutFeedback
                                    onPress={() => this.setState(
                                        {selectedMinute: Math.min(59, this.state.selectedMinute + 5)})}>
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25,
                                            transform: [{rotate: '90deg'}]
                                        }}
                                        source={require("./images/ic_back.png")}/>
                                </TouchableWithoutFeedback>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: 'byekan',
                                        borderRadius: 12,
                                        textAlign: 'center',
                                        backgroundColor: 'white'
                                    }}>
                                    {this.state.selectedMinute}
                                </Text>
                                <TouchableWithoutFeedback
                                    onPress={() => this.setState(
                                        {selectedMinute: Math.max(0, this.state.selectedMinute - 5)})}>
                                    <Image
                                        style={{
                                            width: 25,
                                            height: 25,
                                            transform: [{rotate: '-90deg'}]
                                        }}
                                        source={require("./images/ic_back.png")}/>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#000000',
                                width: '100%',
                                fontSize: 25,
                                textAlign: 'center'
                            }}>
                            موضوع و آدرس
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: '#7fb0ff',
                                color: '#000',
                                textAlign: 'center',
                                fontFamily: 'byekan',
                            }}
                            autoCapitalize="none"
                            onChangeText={(text) => {
                                this.title = text;
                            }}
                            autoCorrect={false}
                            keyboardType='email-address'
                            returnKeyType="next"
                            placeholder='موضوع'
                            placeholderTextColor='#888'/>
                    </View>
                    <View>
                        <Text
                            style={{
                                fontFamily: 'byekan',
                                color: '#000000',
                                width: '100%',
                                fontSize: 25,
                                textAlign: 'center'
                            }}>
                            انتخاب آدرس
                        </Text>
                        <Picker
                            selectedValue={this.state.currentPlace}
                            onValueChange={(value, index) => {
                                if (value !== -1) {
                                    this.setState({currentPlace: value});
                                }
                            }}>
                            {this.state.places.length === 0 ?
                                <Picker.Item label={""} value={-1}/>
                                :
                                <Picker.Item label={"انتخاب کنید"} value={-1}/>
                            }

                            {this.state.places.map(
                                (key, index) =>
                                    <Picker.Item key={index} label={key.title} value={key.pk}/>
                            )}

                        </Picker>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => NavigationService.navigate('ChoosePeople',
                            {
                                date: '1397/' + (this.state.selectedMonth + 1) + '/' + (this.state.selectedDay + 1),
                            })}>
                        <View style={{marginVertical: 10}}>
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
                                    paddingVertical: 10,
                                    paddingHorizontal: 25,
                                }}>
                                تایید
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        color: '#000000',
        fontSize: 18,
        fontFamily: 'byekan'
    }
});

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(AddNewSession);
