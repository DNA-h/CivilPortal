import React, {Component} from "react";
import {FlatList, View, TextInput, Button} from 'react-native';
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

let sampleData = [{name:'naser',place:'مدیر گروه'},{name:'hamed',place:'مدیر'}];

class ChoosePeople extends Component{

    componentDidMount() {
        SplashScreen.hide();
    }

    render(){
        return(
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
                        data={sampleData}
                        renderItem={(item) =>
                            <PeopleItem
                                item={item}/>}
                    />
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

export default connect(mapStateToProps, {counterAdd, counterSub})(ChoosePeople);
