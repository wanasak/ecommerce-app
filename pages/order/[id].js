import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderScreen() {
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchOrder();
  }, [orderId]);

  const {
    shippingAddress,
    orderItems,
    isDelivered,
    paymentMethod,
    deliveredAt,
    isPaid,
    paidAt,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <h1>{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-4">
          <div className="md:col-span-3">
            <div className="card p-4">
              <h2 className="mb-2">Shipping Address</h2>
              <div>
                {shippingAddress.fullName},{shippingAddress.address},
                {shippingAddress.city},{shippingAddress.postalCode},
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">Derivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>

            <div className="card p-4">
              <h2 className="mb-2">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">
                  Payment MethodPaid at {paidAt}
                </div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card p-4 overflow-x-auto">
              <h2 className="mb-2">Order Items</h2>
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-4 text-left">Item</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              height={50}
                              width={50}
                              src={item.image}
                              alt={item.name}
                            ></Image>
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
            </div>
          </div>
          <div>
            <div className="card p-4">
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
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderScreen;

OrderScreen.auth = true;
