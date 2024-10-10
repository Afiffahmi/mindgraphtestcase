import { profileService } from "../services/profile.service";
import { storeGoogleSignInData } from "../services/stores/authStorage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState } from "react";

export default function useProfile() {
  const [profileDetails, setProfileDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const result = await profileService.fetchProfile(userId);
      setProfileDetails(result);
      return result;
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userId: string, changeName: string) => {
    try {
      setIsLoading(true);
      console.log("user Id", userId);
      const result = await profileService.updateProfiles(userId, changeName);

      return result;
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    fetchProfile,
    profileDetails,
    isLoading,
  };
}
