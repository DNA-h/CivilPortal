import React, {Component} from "react";
import {Text, View, FlatList} from 'react-native';
import Wallpaper from "./Wallpaper";
import {connect} from "react-redux";
import {counterAdd, counterSub} from "../Actions";

class CalendarItem extends Component {

    render() {
        return (
            <View
                style={{
                    flexDirection: 'row'
                }}>
                <View>
                    <Text>
                        12:00
                    </Text>
                    <Text>
                        13:00
                    </Text>
                </View>
                <Text>
                    Launch with Sam
                </Text>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    }
}

export default connect(mapStateToProps, {counterAdd, counterSub})(CalendarItem);