import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./profile";
import LoginScreen from "./login";
import { StatusBar, AppState } from "react-native";
import { useMachine } from "@xstate/react";
import stateMachine from "../components/mindGraphTestCaseState";
import ProductScreen from "./product";
import CheckoutScreen from "./checkout";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getGoogleSignInData } from "@/services/stores/authStorage";
import { StripeProvider } from "@stripe/stripe-react-native";
import OrderScreen from "./order";
import { usePushNotifications } from "@/hooks/usePushNotification";

// or ES6+ destructured imports
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = ({ send }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Product"
        component={ProductScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" options={{ headerShown: false }}>
        {(props) => <ProfileScreen {...props} send={send} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const NavigationComponent = () => {
  const { expoPushToken, notification } = usePushNotifications();

  const data = JSON.stringify(notification, undefined, 2);
  const [state, send] = useMachine(stateMachine);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const googleSignInData = await getGoogleSignInData();
        if (googleSignInData && googleSignInData.data.idToken) {
          send({ type: "CAN_LOGIN" });
        } else if (googleSignInData == null) {
          send({ type: "CAN_LOGOUT" });
        }
      } catch (error) {
        send({ type: "CAN_LOGOUT" });
      }
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        checkAuthStatus();
      }
    };

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    checkAuthStatus();

    return () => {
      appStateListener.remove();
    };
  }, []);

  return (
    <>
      <StripeProvider publishableKey="pk_test_51Q7vJgAXiCTdCsj7sa1WEwrx2pSo38LnqEHfPzvOjQEs5uc5BeLDKhygGyOtopp0hUqY8Jmh9qSXDS4hKM9hLD6d00aAAV0lR4">
        <StatusBar style="auto" hidden={true} />
        <NavigationContainer independent={true}>
          <Stack.Navigator>
            {state.matches("login") && (
              <Stack.Screen name="login" options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} send={send} />}
              </Stack.Screen>
            )}

            {state.matches("home") && (
              <>
                <Stack.Screen name="HomeTabs" options={{ headerShown: false }}>
                  {(props) => <HomeTabs {...props} send={send} />}
                </Stack.Screen>
                <Stack.Screen name="checkout" component={CheckoutScreen} />
                <Stack.Screen name="order" component={OrderScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </>
  );
};

export default NavigationComponent;
