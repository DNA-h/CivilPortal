import React, {Component} from "react";
import {FlatList, View, TextInput, Button, Text, TouchableWithoutFeedback} from 'react-native';
import Wallpaper from "./Components/Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "./Actions/index";
import SplashScreen from 'react-native-splash-screen';
import PlaceItem from "./Components/PlaceItem";
import NavigationService from "./Service/NavigationService";

let sampleData = [{name:'naser',place:'دفتر مرکزی'},{name:'hamed',place:'دفتر جنوب تهران'}];

class SelectPlace extends Component{

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
                            <PlaceItem
                                item={item}/>}
                    />
                </View>
                <Button
                    title="بعدی"
                    onPress={() => NavigationService.navigate('ChoosePeople')}/>

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
