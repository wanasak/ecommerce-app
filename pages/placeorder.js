import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";

function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
  );
  const shippingPrice = round2(itemsPrice > 200 ? 0 : 15);
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push("payment");
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);
  const handlerPlaceOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({
        type: "CART_CLEAR_ITEMS",
      });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return (
    <Layout titel="Place Order">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <h1>Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className=" overflow-x-auto md:col-span-3">
            <div className="card">
              <h2>Shipping Address</h2>
              <div>
                {shippingAddress.fullName},{shippingAddress.adress}{" "}
                {shippingAddress.city},{shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              <Link href="/shipping">
                <a>Edit</a>
              </Link>
            </div>
            <div className="card">
              <h2>Payment Method</h2>
              <div>{paymentMethod}</div>
              <Link href="/payment">
                <a>Edit</a>
              </Link>
            </div>
            <div className="card">
              <h2>Order Items</h2>
              <table className=" min-w-full">
                <thead className=" border-b">
                  <tr>
                    <th className="px-4 text-left">Item</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 text-left">
                        <Link href={`/product/${item._id}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              width={50}
                              height={50}
                              alt={item.name}
                            />
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className="p-4 text-right">{item.quantity}</td>
                      <td className="p-4 text-right">${item.price}</td>
                      <td className="p-4 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2">
                <Link href="/cart">
                  <a>Edit</a>
                </Link>
              </div>
            </div>
          </div>
          <div className=" card h-fit">
            <h2>Order Summary</h2>
            <div className="flex justify-between">
              <div>Items</div>
              <div>${itemsPrice}</div>
            </div>
            <div className="flex justify-between">
              <div>Tax</div>
              <div>${taxPrice}</div>
            </div>
            <div className="flex justify-between">
              <div>Shipping</div>
              <div>${shippingPrice}</div>
            </div>
            <div className="flex justify-between">
              <div>Total</div>
              <div>${totalPrice}</div>
            </div>
            <button
              disabled={loading}
              onClick={handlerPlaceOrder}
              className="primary-btn w-full"
            >
              {loading ? "Loading..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PlaceOrderScreen;

PlaceOrderScreen.auth = true;
