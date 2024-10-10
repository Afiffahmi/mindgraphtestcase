import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  Button,
} from "react-native";
import Cart from "../assets/icons/cart";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../firebaseConfig"; // Ensure this is imported
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { useStripe } from "@stripe/stripe-react-native";
import { httpClient } from "../infra/axios-http-client";
import axios from "axios";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get("window");
const AddToCartFloater = ({ cartItems, totalItem }) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [payableAmount, setPayableAmoubt] = useState(100);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    setIsModalVisible(false);
    navigation.navigate("checkout", { cartItems, totalPrice });
  };

  const totalPrice = calculateTotal().toFixed(2);
  const CartModal = useMemo(() => {
    return (
      <Modal
        statusBarTranslucent={false}
        transparent={true}
        visible={isModalVisible}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={{
                marginVertical: "2%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setIsModalVisible(false)}
              >
                <AntDesign name="close" size={24} />
              </TouchableOpacity>

              <View
                style={{
                  position: "absolute",
                  left: "40%",
                }}
              >
                <Text
                  style={{
                    fontSize: width * 0.05,

                    textAlign: "center",
                  }}
                >
                  Your Cart
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <View style={{ width: "35%" }}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    textAlign: "center",
                  }}
                >
                  Item
                </Text>
              </View>
              <View style={{ width: "25%" }}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    textAlign: "center",
                  }}
                >
                  Price (RM)
                </Text>
              </View>
              <View style={{ width: "40%" }}>
                <Text
                  style={{
                    fontSize: width * 0.04,
                    textAlign: "center",

                    right: "9%",
                  }}
                >
                  Quantity
                </Text>
              </View>
            </View>
            <ScrollView style={styles.scrollView}>
              {cartItems?.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: "100%",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Text
                      style={{
                        fontSize: width * 0.03,
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text
                      style={{
                        fontSize: width * 0.03,
                        textAlign: "center",
                      }}
                    >
                      {item.price}
                    </Text>
                  </View>
                  <View style={{ width: "40%" }}>
                    <Text
                      style={{
                        fontSize: width * 0.03,
                        textAlign: "center",

                        right: "9%",
                      }}
                    >
                      {item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View
              style={{
                alignSelf: "center",
                marginVertical: "2%",
                marginTop: "4%",
                flexDirection: "row",
                gap: 20,
              }}
            >
              <Text
                style={{
                  fontSize: width * 0.04,
                  textAlign: "center",
                }}
              >
                TOTAL: RM
              </Text>
              <Text
                style={{
                  fontSize: width * 0.04,

                  textAlign: "center",
                }}
              >
                {totalPrice}
              </Text>
            </View>
            <View style={{ alignSelf: "center", marginBottom: "2%" }}>
              <TouchableOpacity
                onPress={handleCheckout}
                style={{
                  flexDirection: "row",
                  backgroundColor: "blue",
                  paddingVertical: "1%  ",
                  paddingHorizontal: "4%",
                  borderRadius: 20,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: width * 0.04,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  CHECKOUT
                </Text>
                <Entypo name="chevron-right" size={23} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }, [isModalVisible, cartItems]);

  return (
    <View>
      {CartModal}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsModalVisible(true)}
      >
        <AntDesign name="shoppingcart" size={24} />
        <Text>{totalItem}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    alignItems: "center",
    flexDirection: "row",
    width: width / 3,
    height: height / 16,
    justifyContent: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 4,
    borderColor: "white",
  },
  itemCount: {
    // fontSize: RFPercentage(2),
    marginLeft: 5,
    fontWeight: "bold",
    color: "white",
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    height: "50%",
    borderRadius: 10,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: "2%",
  },
  itemContainer: {
    marginBottom: "4%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  itemName: {
    // fontSize: RFPercentage(2),
    fontWeight: "bold",
  },
  itemPrice: {
    // fontSize: RFPercentage(2),
    color: "gray",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  quantityText: {
    // fontSize: RFPercentage(1.7),
    textAlign: "center",
  },
  modalFooter: {},

  footerButtonText: {},
});

export default AddToCartFloater;
