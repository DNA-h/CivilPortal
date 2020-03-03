import React from "react";
import {View, Text, ScrollView} from 'react-native';

export default class MyCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false
    }
  }

  componentDidMount(): void {
    setTimeout(() => this.setState({enabled: true}), 500);
  }

  render() {
    return (
      <ScrollView
        enableMomentum
        initialNumToRender={this.props.data.length}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => '-' + index}
        vertical
        ref={(ref) => {
          if (ref === null || ref === undefined) return;
          ref.scrollTo({x: 0, y: 50 * this.props.first, animated: false})
        }}
        snapToInterval={50}
        snapToAlignment={'start'}
        scrollEnabled={this.state.enabled}
        onScroll={event => {
          this.props.saveFunc(event.nativeEvent.contentOffset.y);
        }}
        style={{
          height: 50,
          width: 30,
        }}
      >
        {
          this.props.data.map((val, index) =>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'byekan',
                  borderRadius: 12,
                  color: '#FFFFFF',
                  textAlign: 'center'
                }}>
                {this.props.data[index]}
              </Text>
            </View>
          )
        }
      </ScrollView>
    )
  }
}