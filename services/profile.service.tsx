import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "@react-native-firebase/auth";

async function fetchProfile(userId: string) {
  try {
    const userItemRef = doc(db, "users", userId);
    const userDoc = await getDoc(userItemRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("cart data ayam", userData);
      return userData;
    } else {
      console.log("No cart data found for user.");
    }
  } catch (error: any) {}
}

async function updateProfiles(userId: string, changeName: string) {
  try {
    const userRef = doc(db, "users", userId);
    const result = await updateDoc(userRef, { displayName: changeName });
    console.log("sdasdasdas", result);
  } catch (error: any) {}
}
export const profileService = {
  fetchProfile,
  updateProfiles,
};
