import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

GoogleSignin.configure({
  webClientId:
    "700656217647-vamakamruj871vj9kkuav94l6c03rlqm.apps.googleusercontent.com",
});

async function googleSignIn() {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    const { user } = response.data;
    console.log("user id", user.id);

    const userDocRef = doc(db, "users", user.id);

    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.name,
        userId: user.id,
      });
    } else {
      console.log("User already exists in Firestore");
    }

    return response;
  } catch (error: any) {
    console.log("Error:", error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("Sign in was cancelled");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Sign in is in progress");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("Play services not available or outdated");
    } else {
      console.log("Some other error", error);
    }
  }
}

export const googleService = {
  googleSignIn,
};
