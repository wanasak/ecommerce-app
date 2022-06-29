import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

const CartScreen = () => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    cart: { cartItems },
  } = state;

  const handleChangeQuantity = (item, qty) => {
    const quantity = Number(qty);
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const handleDeleteItem = (item) => {
    dispatch({
      type: "CART_DELETE_ITEM",
      payload: item.slug,
    });
  };

  return (
    <Layout title="Cart Page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 && (
        <div>
          Cart is empty.{" "}
          <Link href="/">
            <span className="text-blue-600 cursor-pointer">Go shopping</span>
          </Link>
        </div>
      )}
      <div className="grid md:grid-cols-4 md:gap-4">
        <div className="md:col-span-3 overflow-x-auto">
          <table className=" min-w-full">
            <thead className=" border-b">
              <tr>
                <th className="px-5 text-left">Item</th>
                <th className="p-4 text-right">Quantity</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.slug} className="border-b">
                  <td>
                    <Link href={`/product/${item.slug}`}>
                      <a className="flex items-center gap-x-1 text-blue-600 font-medium">
                        <Image src={item.image} width={50} height={50} alt="" />
                        {item.name}
                      </a>
                    </Link>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      name=""
                      id=""
                      className="border p-2 rounded"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChangeQuantity(item, e.target.value)
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((item) => (
                        <option key={item + 1} value={item + 1}>
                          {item + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">${item.price}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDeleteItem(item)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card h-fit">
          <div className="flex justify-between">
            <div>
              Sub Total (
              {cartItems.reduce((prev, curr) => (prev += curr.quantity), 0)})
            </div>
            <div>
              $
              {cartItems.reduce(
                (prev, curr) => (prev += curr.price * curr.quantity),
                0
              )}
            </div>
          </div>
          <button
            className="primary-btn w-full"
            onClick={() => router.push("/shipping")}
          >
            Check Out
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
