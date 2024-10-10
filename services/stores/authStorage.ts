import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeGoogleSignInData = async (data: any) => {
  try {
    await AsyncStorage.setItem("googleSignInData", JSON.stringify(data));
    console.log("Google Sign-In data successfully stored");
  } catch (error) {
    console.error("Error storing Google Sign-In data:", error);
  }
};

export const getGoogleSignInData = async () => {
  try {
    const data = await AsyncStorage.getItem("googleSignInData");
    if (data !== null) {
      return JSON.parse(data);
    } else {
      console.log("No Google Sign-In data found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving Google Sign-In data:", error);
    return null;
  }
};

export const clearGoogleSignInData = async () => {
  try {
    await AsyncStorage.removeItem("googleSignInData");
  } catch (error) {}
};
