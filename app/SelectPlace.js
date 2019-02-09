import React, {Component} from "react";
import {Text, View, TextInput, Button} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import ActionButton from 'react-native-action-button';
import ButtonSubmit from "./Components/ButtonSubmit";
import PersianDatePicker from 'react-native-persian-date-picker';
import NavigationService from "./Service/NavigationService";
import MapView from 'react-native-maps';
import SplashScreen from 'react-native-splash-screen';

class SelectPlace extends Component{

    componentDidMount() {
        SplashScreen.hide();
    }

    render(){
        return(
            <Wallpaper>
                <View>
                    <PersianDatePicker
                        textStyle={{
                            fontFamily: 'byekan'
                        }}/>
                </View>
                <View
                    style={{
                        flex: 1
                    }}>
                    <TextInput
                        placeholder={"عنوان"}/>

                    <TextInput
                        placeholder={"ساعت شروع"}/>

                    <TextInput
                        placeholder={"ساعت پایان"}/>
                </View>
                <Button
                    title="بعدی"
                    onPress={() => NavigationService.navigate('AddNewSession',null)}/>

            </Wallpaper>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(SelectPlace);
