import React from "react";
import Header from "../../Components/Header/Header";

const PaymentCancel = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden pb-20">
        {/* Container */}
        <div className="w-full max-w-4xl p-8 text-center rounded-lg">
          {/* Success Icon */}
          <div className="flex justify-center mb-16">
            <div className="bg-red-500 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Header Text */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6 whitespace-nowrap">
            OOPS! Payment Failed
          </h1>

          {/* Description Text */}
          <p className="text-gray-500 mb-6">
            We couldn't complete your payment. Please double-check your <br />{" "}
            payment information and try again.
          </p>

          {/* Button */}
          <button className="w-2/4 md:w-1/4 py-3 m-3 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 focus:outline-none">
            Return to App
          </button>
          <button className="w-2/4 md:w-1/4 py-3  bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 focus:outline-none">
            Try Again Now
          </button>
        </div>

        {/* Footer */}
        <div className="mt-32 font-bold text-xl">
          Need help?{" "}
          <a href="#" className=" hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
