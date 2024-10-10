import React, { useEffect, useState } from "react";
import { View, Button, Alert, Image, Text, TextInput } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import {
  clearGoogleSignInData,
  getGoogleSignInData,
} from "@/services/stores/authStorage";
import { useNavigation } from "@react-navigation/native";
import useProfile from "@/hooks/useProfile";

const ProfileScreen = ({ send }) => {
  const navigation = useNavigation();

  const [isEditable, setIsEditable] = useState(false);
  const [userProfiler, setUserProfile] = useState();
  const { fetchProfile, profileDetails, updateProfile, isLoading } =
    useProfile();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    getUserInformation();
  }, []);
  const getUserInformation = async () => {
    const googleSignInData = await getGoogleSignInData();

    if (googleSignInData) {
      try {
        await setUserProfile(googleSignInData);

        const result = await fetchProfile(googleSignInData.data.user.id);
      } catch (error) {
      } finally {
      }
    }
  };
  const handleLogout = async () => {
    try {
      await clearGoogleSignInData();
      send({ type: "CAN_LOGOUT" });
    } catch (error) {}
  };

  const handleUpdateName = async () => {
    try {
      if (userProfiler) {
        const result = await updateProfile(
          userProfiler?.data.user.id,
          displayName
        );
      }
    } catch (error) {
      // console.error("Error updating name:", error);
      // Alert.alert("Error", "Failed to update name.");
    } finally {
    }
  };

  console.log(userProfiler?.data.user.photo);
  console.log(profileDetails);
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: 20,
      }}
    >
      {isLoading ? (
        <>
          <Text>Loadinbg ...</Text>
        </>
      ) : (
        <>
          {userProfiler?.data.user.photo && (
            <Image
              source={{ uri: userProfiler?.data.user.photo }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
          )}
          <Text>Hi, {profileDetails?.displayName}</Text>
          <Button
            title="Change your name?"
            onPress={() => setIsEditable(true)}
          />
          {isEditable ? (
            <>
              <TextInput
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  padding: 10,
                  marginVertical: 10,
                  width: "80%",
                }}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
              />
              <Button title="Update Name" onPress={handleUpdateName} />
              <Button title="Cancel" onPress={() => setIsEditable(false)} />
            </>
          ) : null}

          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
    </View>
  );
};

export default ProfileScreen;
