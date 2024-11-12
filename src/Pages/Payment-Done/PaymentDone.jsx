import React from "react";
import Header from "../../Components/Header/Header";
import AnimationTickmarck from "../../assets/AnimationTickmarck.gif";

const PaymentDone = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden pb-20">
        <div className="w-full max-w-4xl p-8 text-center rounded-lg">
          <div className="flex justify-center mb-6"> 
            <div>
              <img
                src={AnimationTickmarck}
                alt="Success Tick Mark"
                className="w-60 h-60 md:w-60 md:h-60 object-contain" 
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"> 
            PAYMENT REQUEST SUBMITTED
          </h1>
          <p className="text-md sm:text-lg mb-6 font-bold">Transaction No: 92474624013</p>

          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            Our team is working on it and soon your balance will be added <br />{" "}
            to your wallet.
          </p>

          <button className="w-3/4 md:w-1/3 py-3 font-bold bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none">
            Return to App
          </button>
        </div>

        <div className="pt-20 text-xl font-bold ">
          Need help?{" "}
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
};

export default PaymentDone;