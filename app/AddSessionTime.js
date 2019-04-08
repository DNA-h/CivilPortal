import React, {Component} from "react";
import {
    StyleSheet, View, TextInput,
    TouchableWithoutFeedback, Text,
    ScrollView, Keyboard, Dimensions, ImageBackground
} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import PersianDatePicker from 'react-native-persian-date-picker';
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';
import KeyboardSpacer from "react-native-keyboard-spacer";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {WheelPicker, TimePicker, DatePicker} from 'react-native-wheel-picker-android'
import MapView from 'react-native-maps';

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
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class AddSessionTime extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedStartHour: 10,
            selectedStartMinute: 0,
            selectedEndHour: 12,
            selectedEndMinute: 0,
        };
    }

    render() {
        console.log('month ', this.state.selectedMonth, ' day ', this.state.selectedDay);
        return (
            <View
                style={{flex: 1}}>

                <View
                    style={{
                        flex: 1,
                        width: DEVICE_WIDTH,
                        height: DEVICE_HEIGHT,
                    }}
                >
                    <View style={{flex: 1}}/>
                    <Text
                        style={{
                            fontFamily: 'byekan',
                            color: '#000000',
                            width: '100%',
                            fontSize: 20,
                            textAlign: 'center'
                        }}>
                        لطفا ساعت شروع جلسه را تعیین نمایید.
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <WheelPicker
                            style={{width: 50, height: 180}}
                            selectedItem={this.state.selectedStartHour}
                            data={dailyHour}
                            onItemSelected={selectedItem => {
                                this.setState({selectedStartHour: selectedItem})
                            }}
                            selectedItemTextColor={'#aa3835'}
                            selectedItemTextSize={25}
                            itemTextSize={25}
                            selectedItemTextFontFamily={'seven_segment'}
                            itemTextFontFamily={'seven_segment'}/>
                        <Text style={{fontSize: 25}}>
                            :
                        </Text>
                        <WheelPicker
                            style={{width: 50, height: 180}}
                            selectedItem={this.state.selectedStartMinute}
                            data={dailyMinutes}
                            onItemSelected={selectedItem => {
                                this.setState({selectedStartMinute: selectedItem})
                            }}
                            selectedItemTextColor={'#3daa48'}
                            selectedItemTextSize={25}
                            itemTextSize={25}
                            selectedItemTextFontFamily={'seven_segment'}
                            itemTextFontFamily={'seven_segment'}/>
                    </View>
                    <Text
                        style={{
                            fontFamily: 'byekan',
                            color: '#000000',
                            width: '100%',
                            fontSize: 20,
                            textAlign: 'center'
                        }}>
                        لطفا ساعت پایان جلسه را تعیین نمایید.
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <WheelPicker
                            style={{width: 50, height: 180}}
                            selectedItem={this.state.selectedEndHour}
                            data={dailyHour}
                            onItemSelected={selectedItem => {
                                this.setState({selectedEndHour: selectedItem})
                            }}
                            selectedItemTextColor={'#aa3835'}
                            selectedItemTextSize={25}
                            itemTextSize={25}
                            selectedItemTextFontFamily={'seven_segment'}
                            itemTextFontFamily={'seven_segment'}/>
                        <Text style={{fontSize: 25}}>
                            :
                        </Text>
                        <WheelPicker
                            style={{width: 50, height: 180}}
                            selectedItem={this.state.selectedEndMinute}
                            data={dailyMinutes}
                            onItemSelected={selectedItem => {
                                this.setState({selectedEndMinute: selectedItem})
                            }}
                            selectedItemTextColor={'#3daa48'}
                            selectedItemTextSize={25}
                            itemTextSize={25}
                            selectedItemTextFontFamily={'seven_segment'}
                            itemTextFontFamily={'seven_segment'}/>
                    </View>
                    <View style={{flex: 1}}/>
                    <TouchableWithoutFeedback
                        style={{
                            marginVertical: 40,
                            marginBottom: 40,
                        }}
                        onPress={() => NavigationService.navigate('AddSessionTitle',
                            {
                                date: this.props.navigation.getParam('date'),
                                start: this.state.selectedStartHour + ':' + this.state.selectedStartMinute,
                                end: this.state.selectedEndHour + ':' + this.state.selectedEndMinute
                            })}>
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
                                بعدی
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <KeyboardSpacer/>

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

export default connect(mapStateToProps, {counterAdd, counterSub})(AddSessionTime);
