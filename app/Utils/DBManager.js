import {AsyncStorage, Platform, StatusBar, Dimensions} from 'react-native';

const {height} = Dimensions.get("window");
const deviceHeight =
  Platform.OS === "android"
    ? height - StatusBar.currentHeight
    : height;

export default class DBManager {
  static async getSettingValue(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null)
        return value;
      else
        return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async saveSettingValue(key, value) {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
      console.log("Error saving data" + e);
    }
  }

  static RFPercentage(percent) {
    const heightPercent = (percent * deviceHeight) / 100;
    return Math.round(heightPercent);
  }

  static RFValue(fontSize) {
    // guideline height for standard 5" device screen
    const standardScreenHeight = 680;
    const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
    return Math.round(heightPercent);
  }
}
