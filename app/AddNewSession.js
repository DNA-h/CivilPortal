import React, {Component} from "react";
import {Text, View, FlatList, Button} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import ActionButton from 'react-native-action-button';
import ButtonSubmit from "./Components/ButtonSubmit";
import PersianDatePicker from 'react-native-persian-date-picker';
import NavigationService from "./Service/NavigationService";

class AddNewSession extends Component{

    render(){
        return(
            <Wallpaper>
                <View>
                    <PersianDatePicker/>
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

export default connect(mapStateToProps, {counterAdd, counterSub})(AddNewSession);