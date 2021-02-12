import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (name, data) => {
  try {
    await AsyncStorage.setItem(name, JSON.stringify(data));
    console.log("data berhasil disimpan");
  } catch (error) {
    console.log("error saving data ", e);
  }
};

export const getValue = async (name) => {
  try {
    const data = await AsyncStorage.getItem(name);
    // console.log("data getValue ", JSON.parse(data));
    return JSON.parse(data);
  } catch (e) {
    console.log("error getting data ", e);
  }
};

export const removeValue = async (name) => {
  try {
    await AsyncStorage.removeItem(name);
    console.log("data berhasil dihapus");
  } catch (e) {
    console.log("error remove data ", e);
  }
};
