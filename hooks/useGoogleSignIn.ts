import { googleService } from "../services/googleSignIn.service";
import { storeGoogleSignInData } from "../services/stores/authStorage";
export default function useGoogleSignIn() {
  const googleSignIn = async () => {
    try {
      const result = await googleService.googleSignIn();

      if (result?.data) {
        await storeGoogleSignInData(result);
      }
      return result;
    } catch (error: any) {
    } finally {
    }
  };

  return {
    googleSignIn,
  };
}
