import {AsyncStorage} from 'react-native';

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
}
