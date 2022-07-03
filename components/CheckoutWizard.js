import React from "react";

const CheckoutWizard = ({ activeStep = 0 }) => {
  const steps = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];
  return (
    <div className="flex flex-wrap">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`
          flex-1 border-b-2 text-center pb-1
          ${activeStep === index && "text-orange-600 border-orange-400"}
          `}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default CheckoutWizard;
