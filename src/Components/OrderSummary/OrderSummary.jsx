import React from 'react';

function OrderSummary({ amount, tax, subtotal }) {
  return (
    <div className="text-gray-400 lg:px-[22px]">
      <h2 className="sm:text-[21px] font-[700]  text-black mb-4">
        Order Summary
      </h2>
      <div className="flex font-[600] justify-between sm:text-sm  mb-2">
        <span>Amount:</span>
        <span>Rs: {amount}</span>
      </div>
      <div className="flex font-[600] justify-between  sm:text-sm  mb-2">
        <span>Tax:</span>
        <span>16% ({tax})</span>
      </div>
      <div className="flex font-[600] justify-between  mt-4 sm:text-sm ">
        <span>Sub Total:</span>
        <span>Rs: {subtotal}</span>
      </div>
      <div className="border-b-2 pt-3 sm:pt-5"></div>
      <div className="flex justify-between  font-bold text-sm sm:text-base text-black mt-4">
        <span>Total:</span>
        <span className="text-[--main]">Rs: {subtotal}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
