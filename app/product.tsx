import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from "react-native";
import ProductData from "../productjson/product.json";
import AddToCartFloater from "@/components/addToCart";
import { getGoogleSignInData } from "@/services/stores/authStorage";
import useCart from "@/hooks/useCart";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get("window");

const ProductScreen = () => {
  const navigation = useNavigation();
  const { addToCart, fetchCartItems } = useCart();
  const [totalItem, setTotalItem] = useState();
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState(ProductData.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setAllProducts(ProductData.products);
    setFilteredProducts(ProductData.products);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    getCartItems();
  }, []);

  const filterProducts = () => {
    let filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (minPrice !== "") {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (item) => {
    const googleSignInData = await getGoogleSignInData();
    try {
      setIsLoading(true);
      if (googleSignInData) {
        await addToCart(item, googleSignInData.data.user.id);
      }
    } finally {
      setIsLoading(false);
      getCartItems();
    }
  };

  const getCartItems = async () => {
    const googleSignInData = await getGoogleSignInData();
    if (googleSignInData) {
      try {
        setIsLoading(true);
        const result = await fetchCartItems(googleSignInData.data.user.id);
        const totalQuantity = result?.items.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setTotalItem(totalQuantity);
        setCartItems(result.items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOrder = async () => {
    navigation.navigate("order");
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleAddToCart(item)}>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: "90%", height: "80%" }}
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>RM{item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 30 }}>
            Loading .....
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={styles.priceFilterContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min price"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.priceInput}
                placeholder="Max price"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 30,
            }}
          >
            <View style={{ alignSelf: "flex-start", flex: 1 }}>
              <TouchableOpacity
                style={{
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
                }}
                onPress={handleOrder}
              >
                <AntDesign name="meho" size={24} />
                <Text>Order</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              <AddToCartFloater cartItems={cartItems} totalItem={totalItem} />
            </View>
          </View>

          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  searchContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  priceFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "48%",
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
    width: width / 2 - 30,
    height: height / 3 - 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "green",
    marginTop: 5,
  },
});

export default ProductScreen;
