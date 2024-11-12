import React from "react";
import Header from "../../Components/Header/Header";
import Gpay from '../../assets/Gpay.png'
import Blogs_Payt from '../../assets/Blogs_Payt.png'


const WaitingforUPIApproval = () => {

  return (
    <div> 
      <Header />

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="rounded-r p-10 max-w-3xl w-full border-l-4 border-t-2 border-t-gray-300 border-r-2 border-r-gray-300 border-b-2 border-b-gray-300  border-yellow-500">
          {/* Step 1 */}
          <div className="flex items-start mb-6">
            <div className="w-32 h-28 bg-customteal rounded flex items-center justify-center">
              {/* GPay Logo */}
              <img
                src={Gpay}
                alt="GPay"
                className="w-18 h-8"
              />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-800 mt-4">Step 1</h3>
              <p className="text-gray-600">
                Go to{" "}
                <span className=" text-gray-800 font-bold">Google Pay</span>{" "}
                Mobile app
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start mb-6">
            <div className="w-32 h-28 bg-customteal rounded flex items-center justify-center">
              {/* UPI Logo */}
              <img
                src={Blogs_Payt}
                alt="UPI"
                className="w-24 h-20 mt-8"
              />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-800 mt-4">Step 2</h3>
              <p className="text-gray-600">
                Check pending requests and approve payment <br /> by entering{" "}
                <span className="font-bold text-gray-800">UPI PIN</span>
              </p>
            </div>
          </div>

          {/* Transaction Timer */}
          <div className="w-7/12 flex mx-auto items-center justify-center border-2 text-green-700 text-2xl rounded py-2 px-4">
            Transaction expires in <span className="ml-2 text-black">15:00</span>
          </div>

          {/* Cancel Button */}
          <button className="w-full font-medium py-2 mb-6 hover:underline">
            Cancel
          </button>

          {/* Alternative Payment Options */}
          <p className="text-center font-bold text-sm mt-10">
            Can't pay with UPI?{" "}
            <a href="#" className="text-green-600 hover:underline">
              Choose another payment option
            </a>
          </p>
        </div>
      </div>

      <div className="sm:w-auto sm:mt-0 ml-auto flex items-center justify-center font-semibold sm:text-3xl">
        Need help? Contact Us
      </div>
    </div>
  );
};

export default WaitingforUPIApproval;
