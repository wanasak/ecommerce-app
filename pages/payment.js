import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

function PaymentScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment Method is required");
    }
    dispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: selectedPaymentMethod,
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit}>
        <h1 className=" text-center p-4 text-xl">Payment Method</h1>
        {["Paypal", "Stripe", "Cash"].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              name="paymentMethod"
              type="radio"
              id={payment}
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment} className="p-2">
              {payment}
            </label>
          </div>
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            className="default-btn w-24"
            onClick={() => router.push("/shipping")}
          >
            Previous
          </button>
          <button className="primary-btn w-24">Next</button>
        </div>
      </form>
    </Layout>
  );
}

export default PaymentScreen;
