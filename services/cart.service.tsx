import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function addCart(item: any, userId: string) {
  try {
    const cartItemRef = doc(db, "carts", userId);
    const cartDoc = await getDoc(cartItemRef);
    let cartItems = cartDoc.exists() ? cartDoc.data().items || [] : [];

    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      });
    }

    await setDoc(cartItemRef, { items: cartItems });
    return cartItems;
  } catch (error: any) {}
}
async function fetchCart(userId: string) {
  try {
    const cartItemRef = doc(db, "carts", userId);
    const cartDoc = await getDoc(cartItemRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      console.log("cart data ayam", cartData);
      return cartData;
    } else {
      console.log("No cart data found for user.");
    }
  } catch (error: any) {}
}

async function fetchOrder(userId: string) {
  try {
    const orderItemRef = doc(db, "oderCompelete", userId);
    const orderDoc = await getDoc(orderItemRef);

    if (orderDoc.exists()) {
      const orderData = orderDoc.data();
      console.log("cart data ayam", orderData);
      return orderData;
    } else {
      console.log("No cart data found for user.");
    }
  } catch (error: any) {}
}

export const cartService = {
  addCart,
  fetchCart,
  fetchOrder,
};
