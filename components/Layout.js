import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Store } from "../utils/Store";

const Layout = ({ title, children }) => {
  const { status, data: session } = useSession();
  const { state } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(
      cart.cartItems.reduce((acc, item) => (acc += item.quantity), 0)
    );
  }, [cart.cartItems]);

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
                session.user.name
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
