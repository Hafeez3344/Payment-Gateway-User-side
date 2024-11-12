import React from "react";
import paymentall2 from "../../assets/paymentall2.svg";

const Footer = () => {
  return (
    <div className="sm:w-4/5 flex flex-wrap mx-auto gap-2 pl-6">
    <img className="sm:w-8/12" src={paymentall2} alt="" />
    <div className="sm:w-auto mt-4 sm:mt-0 mx-auto flex items-center justify-center font-bold text-sm sm:text-2xl">
      Need help? Contact Us
    </div>
  </div>
  );
};

export default Footer;
