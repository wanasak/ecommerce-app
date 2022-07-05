import React from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";

function PlaceOrderScreen() {
  return (
    <Layout titel="Place Order">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
    </Layout>
  );
}

export default PlaceOrderScreen;
