import React, {Component} from "react";
import {StyleSheet, View, TextInput, Button, TouchableWithoutFeedback, Text} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import PersianDatePicker from 'react-native-persian-date-picker';
import NavigationService from "./Service/NavigationService";
import SplashScreen from 'react-native-splash-screen';

class AddNewSession extends Component{

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
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <TextInput
                        placeholderTextColor={'#C0C0C0'}
                        style={styles.textInput}
                        placeholder={"عنوان"}/>

                    <TextInput
                        placeholderTextColor={'#C0C0C0'}
                        style={styles.textInput}
                        placeholder={"ساعت شروع"}/>

                    <TextInput
                        placeholderTextColor={'#C0C0C0'}
                        style={styles.textInput}
                        placeholder={"ساعت پایان"}/>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => NavigationService.navigate('SelectPlace',null)}>
                    <Text
                        style={{
                            fontFamily: 'byekan',
                            fontSize: 18,
                            color: '#FFFFFF',
                            alignSelf: 'center',
                            backgroundColor: '#5585ff',
                            borderRadius: 30,
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            marginBottom: 25
                        }}>
                        "بعدی"
                    </Text>
                </TouchableWithoutFeedback>

            </Wallpaper>
        );
    }
}

const styles = StyleSheet.create({
    textInput:{
        color: '#FFFFFF',
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
