import React from 'react';
import {Text, View, Image} from 'react-native';


export default class AboutUs extends React.Component {


  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2442ff',
          width: '100%',
          height: '100%'
        }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '70%',
          height: '70%',
          backgroundColor: '#fcffec',
          borderRadius: 50
        }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={require('./images/ic_back.png')}
              style={{margin: 10}}
            />
            <Text
              style={{
                fontSize: 20,
                marginLeft: 40,
                marginRight: 40
              }}
            >
              درباره ما
            </Text>
            <Image
              source={require('./images/car.png')}
              style={{margin: 10}}
            />
          </View>
          <Image
            source={require('./images/logo.png')}
            style={{
              width: '20%',
              height: '20%',
              marginTop: 70,
              tintColor: '#000'
            }}
          />
          <Text
            style={{
              color: '#000',
              marginTop: 20
            }}
          >
            یک عنوان
          </Text>
          <Text
            style={{margin: 20}}
          >
            در این صفحه درخواست مشتری وارد می شود .در این خصو.ص می توانید ازصفحه
            پشتیبانی درخواست خودرا ثبت کنید
          </Text>
        </View>
      </View>
    );
  }
}