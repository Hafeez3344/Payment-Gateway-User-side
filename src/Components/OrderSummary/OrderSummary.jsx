import React from 'react';

function OrderSummary({ amount, tax, subtotal }) {
  return (
    <div className="text-gray-400 font-bold">
      <h2 className="text-base sm:text-lg lg:text-xl text-black font-bold mb-4">
        Order Summary
      </h2>
      <div className="flex justify-between text-xs sm:text-sm lg:text-base mb-2">
        <span>Amount:</span>
        <span>Rs: {amount}</span>
      </div>
      <div className="flex justify-between text-xs sm:text-sm lg:text-base mb-2">
        <span>Tax:</span>
        <span>16% ({tax})</span>
      </div>
      <div className="flex justify-between mt-4 text-xs sm:text-sm lg:text-base">
        <span>Sub Total:</span>
        <span>{subtotal}</span>
      </div>
      <div className="border-b-4 pt-3 sm:pt-5"></div>
      <div className="flex justify-between text-sm sm:text-base text-black mt-4">
        <span>Total:</span>
        <span className="text-orange-500">{subtotal}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
