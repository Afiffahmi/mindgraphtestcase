import { cartService } from "../services/cart.service";
import { storeGoogleSignInData } from "../services/stores/authStorage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState } from "react";

export default function useCart() {
  const [order, setOrder] = useState(false);
  const addToCart = async (item: any, userId: string) => {
    try {
      const result = await cartService.addCart(item, userId);
    } catch (error) {}
  };

  const fetchCartItems = async (userId: string) => {
    try {
      const result = await cartService.fetchCart(userId);
      return result;
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchOrderItems = async (userId: string) => {
    try {
      console.log(userId);
      const result = await cartService.fetchOrder(userId);

      if (result) {
        setOrder(result.items);
      }

      return result;
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  return {
    addToCart,
    fetchCartItems,
    fetchOrderItems,
    order,
  };
}
