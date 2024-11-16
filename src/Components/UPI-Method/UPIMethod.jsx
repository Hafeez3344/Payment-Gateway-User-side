import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Qrcode from "../../assets/Qrcode.svg";
import attention from "../../assets/attention.gif";
import cloudupload from "../../assets/cloudupload.svg";

function UPIMethod({ selectedUPIMethod = "viaQR" }) {
  const navigate = useNavigate();
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="rounded-tr-md rounded-br-md flex flex-col">
      <div className="flex flex-col items-start">
        {selectedUPIMethod === "viaQR" ? (
          <div>
            <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
              Scan to Pay
            </p>
            <div className="flex gap-[30px] items-center">
              <img
                src={Qrcode}
                alt="QR Code"
                className="w-[95px] sm:w-[110px]"
              />
              <div className="mb-4">
                <p className="mb-1 flex items-center gap-[4px]">
                  <span className="text-[16px] font-[700]">Scan and Pay</span>{" "}
                  <span className="text-[17px] font-[700] text-[--main] mb-[-2px]">
                    ₹1160
                  </span>
                </p>
                <p className="text-[15px]">
                  <span className="font-[500]">UPI ID:</span>{" "}
                  paymentrahul198@upi.com
                </p>
              </div>
            </div>
            <div className="flex items-center my-[18px]">
              <img
                src={attention}
                alt="Attention Sign"
                className="w-12 sm:w-16 lg:w-[90px] mb-2 sm:mb-0 ml-[-22px]"
              />
              <p className="italic text-gray-500 text-[15px]">
                After transfer the payment in the UPI <br /> Account, please
                attach the receipt below.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
              Scan to Pay
            </p>
            <input
              type="text"
              placeholder="Enter UPI ID"
              className="w-[300px] sm:w-[450px] h-[45px] border px-[20px]  rounded-md focus:outline-none text-[14px]"
            />
            <button
              onClick={() => navigate("/waiting-for-upi-approval")}
              className="w-full sm:w-[450px] bg-[--main] font-[500] mt-4 text-[15px] h-[45px] text-white rounded-md"
            >
              Pay Now
            </button>
          </div>
        )}
      </div>

      {selectedUPIMethod === "viaQR" && (
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="flex gap-3 items-center">
            <label className="w-[150px]">
              <input type="file" className="cursor-pointer hidden " />
              <div className="px-3 py-2 sm:px-4 h-[45px] border border-black rounded-md cursor-pointer flex items-center justify-center text-gray-700 ">
                <img src={cloudupload} alt="Upload" className="w-5 h-5 mr-2" />
                <span className="text-gray-400 font-[400]">Upload File</span>
              </div>
            </label>
            <p className="text-[14px] font-[600]">
              Attach transaction slip here
            </p>
          </div>
          <input
            type="text"
            placeholder="Enter UTR Number"
            className="w-full text-gray-400 font-[400] border border-[--secondary] h-[45px] px-[20px] rounded-md focus:outline-none text-[15px]"
          />
          <button
            onClick={() => navigate("/payment-done")}
            className="w-full bg-[--main] font-[500] text-[15px] h-[45px] text-white rounded-md"
          >
            Submit Now
          </button>
        </div>
      )}
    </div>
  );
}

export default UPIMethod;
