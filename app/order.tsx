import useCart from "@/hooks/useCart";
import { getGoogleSignInData } from "@/services/stores/authStorage";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";

const OrderScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchOrderItems, order } = useCart();

  useEffect(() => {
    getOrder();
  }, []);
  const getOrder = async () => {
    const googleSignInData = await getGoogleSignInData();
    if (googleSignInData) {
      try {
        setIsLoading(true);
        const result = await fetchOrderItems(googleSignInData.data.user.id);
        // setOrderItem(result.items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  console.log(JSON.stringify(order, null, 4));
  return (
    <View style={{ flex: 1, padding: 10 }}>
      {isLoading ? (
        <Text>Loading ....</Text>
      ) : (
        <FlatList
          data={order}
          keyExtractor={(order) => order.orderId}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20,
                padding: 10,
                backgroundColor: "#f9f9f9",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}
              >
                Order ID: {item.orderId}
              </Text>
              <Text>Name: {item.name}</Text>
              <Text>Address: {item.address}</Text>
              <Text>Total Price: ${item.price}</Text>
              <Text>
                Payment Complete: {item.isPaymentComplete ? "Yes" : "No"}
              </Text>
              <Text style={{ fontWeight: "bold", marginTop: 10 }}>Items:</Text>
              {item.item.map((product) => (
                <View key={product.id} style={{ marginTop: 10 }}>
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={{ width: 100, height: 100, marginBottom: 5 }}
                  />
                  <Text>Product: {product.name}</Text>
                  <Text>Price: RM{product.price}</Text>
                  <Text>Quantity: {product.quantity}</Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default OrderScreen;
