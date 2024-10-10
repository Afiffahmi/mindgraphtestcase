import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { httpClient } from "../infra/axios-http-client";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getGoogleSignInData } from "@/services/stores/authStorage";
import cuid from "cuid";
import { useNavigation } from "expo-router";

const CheckoutScreen = ({ route }) => {
  const { cartItems, totalPrice } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [contactNumber, setContactNumber] = useState("");
  const navigation = useNavigation();
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await httpClient.post("/create-payment-intent", {
        amount: Number(totalPrice * 100),
        currency: "usd",
      });

      return response;
    } catch (error) {
      return error;
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const result = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: result.customer,
        customerEphemeralKeySecret: result.ephemeralKey,
        paymentIntentClientSecret: result.paymentIntent,

        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: "ayam Doe",
        },
      });
    } catch (e) {
      console.log("eeror initalize payment", e);
    } finally {
      openPaymentSheet();
    }
  };

  const openPaymentSheet = async () => {
    try {
      setIsLoading(true);
      const googleSignInData = await getGoogleSignInData();
      const { error } = await presentPaymentSheet();

      if (error) {
        if (googleSignInData) {
          const orderItemRef = doc(
            db,
            "oderCompelete",
            googleSignInData.data.user.id
          );
          const orderDoc = await getDoc(orderItemRef);

          let orderItems = orderDoc.exists() ? orderDoc.data().items || [] : [];

          const newOrder = {
            orderId: cuid(),
            name: name,
            address: address,
            price: totalPrice,
            item: cartItems,
            isPaymentComplete: false,
          };
          orderItems.push(newOrder);
          await setDoc(orderItemRef, { items: orderItems });
          Alert.alert("Error", `Your order error is:${error}`, [
            {
              text: "OK",
              onPress: () => navigation.navigate("order"),
            },
          ]);
        }
      } else {
        if (googleSignInData) {
          const orderItemRef = doc(
            db,
            "oderCompelete",
            googleSignInData.data.user.id
          );
          const orderDoc = await getDoc(orderItemRef);

          let orderItems = orderDoc.exists() ? orderDoc.data().items || [] : [];

          const newOrder = {
            orderId: cuid(),
            name: name,
            address: address,
            price: totalPrice,
            item: cartItems,
            isPaymentComplete: true,
          };

          orderItems.push(newOrder);

          await setDoc(orderItemRef, { items: orderItems });
          Alert.alert(
            "Order Successful",
            "Your order has been placed successfully!",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("order"),
              },
            ]
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!name || !address || !contactNumber) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    } else {
      initializePaymentSheet();
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ textAlign: "center" }}>Loading ...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Checkout</Text>
          <ScrollView>
            {cartItems.map((item) => (
              <View key={item.id.toString()} style={styles.itemContainer}>
                <Text>{item.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Price: ${item.price}</Text>
              </View>
            ))}
            <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>

            {/* User input fields */}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
            />

            <Button title="Proceed to Payment" onPress={handlePayment} />
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default CheckoutScreen;
