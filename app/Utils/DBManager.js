import {AsyncStorage, Platform, StatusBar, Dimensions} from 'react-native';

const {height, width} = Dimensions.get("window");
const arabicNumbers = ['۰', '۱', '٢', '٣', '۴', '۵', '۶', '۷', '٨', '٩'];

export default class DBManager {
  static shamsiCounter = [0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365];
  static hijriCounter = [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325, 354];

  static async getSettingValue(key, defalt) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null)
        return value;
      // if (key!== "token")return value;
      // else return "97d888a5ac13cd2ae22cf3b587b92613735af22a";
      // return '766e632f3d3d0ec89c940acfb43b8f6b61e9fdeb';
      else
        return defalt;
    } catch (e) {
      console.log(e);
      return defalt;
    }
  }

  static async saveSettingValue(key, value) {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
      console.log("Error saving data" + e);
    }
  }

  static RFHeight(percent) {
    const heightPercent = (percent * height) / 100;
    return Math.round(heightPercent);
  }

  static RFWidth(percent) {
    const heightPercent = (percent * (width - 50)) / 100;
    return Math.round(heightPercent);
  }

  static RFValue(fontSize) {
    // guideline height for standard 5" device screen
    const standardScreenHeight = 680;
    const heightPercent = (fontSize * height) / standardScreenHeight;
    return Math.round(heightPercent);
  }

  static toArabicNumbers(value) {
    if (value.split === undefined)
      value = `${value}`;
    const chars = value.split('');
    for (let index in chars)
      if (chars[index] >= '0' && chars[index] <= '9')
        chars[index] = arabicNumbers[chars[index] - '0'];
    return chars.join('');
  }
}
