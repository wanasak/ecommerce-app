import { Menu } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../utils/Store";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";

const Layout = ({ title, children }) => {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(
      cart.cartItems.reduce((acc, item) => (acc += item.quantity), 0)
    );
  }, [cart.cartItems]);

  const handleLogout = () => {
    dispatch({
      type: "CART_RESET",
    });
    Cookies.remove("cart");
    signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - Smudger" : "Smudger"}</title>
        <meta name="description" content="Ecommerce" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex items-center justify-between h-12 shadow-md px-4">
            <Link href="/">
              <a className="font-semibold text-xl">smudger</a>
            </Link>
            <div>
              <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 bg-red-600 top-0 -right-2 text-white py-0.5 px-1.5 text-xs font-semibold rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className=" relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute z-50 right-0 w-56 origin-top-right bg-white shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={handleLogout}
                        className="dropdown-link"
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Colpyright 2022</p>
        </footer>
      </div>
    </>
  );
};

export default Layout;
