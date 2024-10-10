import { Image, StyleSheet, Platform, View, Text, Button } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import { router } from "expo-router";
import { db } from "../firebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const LoginScreen = ({ send }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { googleSignIn } = useGoogleSignIn();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await googleSignIn();
      if (result) {
        send({ type: "CAN_LOGIN" });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {isLoading ? (
        <Text style={{ fontSize: 30 }}>Loading ...</Text>
      ) : (
        <View style={{ marginTop: "50%" }}>
          <Text style={{ fontSize: 20, color: "black" }}>sdasdsa</Text>
          <GoogleSigninButton onPress={handleLogin} />
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
