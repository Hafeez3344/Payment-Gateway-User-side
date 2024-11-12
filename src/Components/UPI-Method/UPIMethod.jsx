import React from "react";
import { useNavigate } from "react-router-dom";
import Qrcode from "../../assets/Qrcode.png";

function UPIMethod({ selectedUPIMethod = "viaQR" }) {
  const navigate = useNavigate();

  return (
    <div className="p-4 min-h-[600px] flex flex-col justify-between">
      <div>
        {selectedUPIMethod === "viaQR" ? (
          <>
            <p className="text-xl sm:text-3xl font-bold text-center sm:text-left mb-4">
              Scan to Pay
            </p>
            <img
              src={Qrcode}
              alt="QR Code"
              className="w-16 sm:w-20 lg:w-32 mx-auto sm:mx-0 mb-4"
            />
            <p className="font-bold text-sm sm:text-base mb-4 text-center sm:text-left">
              After transferring the payment to the UPI Account, please attach
              the receipt below.
            </p>
          </>
        ) : (
          <>
            <p className="text-xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
              Enter UPI ID
            </p>
            <input
              type="text"
              placeholder="Enter UPI ID"
              className="w-full px-3 py-2 sm:px-4 sm:py-4 border rounded-md mb-6"
            />
            <button
              onClick={() => navigate("/Waiting-for-UPI-Approval")}
              className="w-full py-3 sm:py-4 bg-yellow-400 text-white rounded-md font-semibold mb-4"
            >
              Pay Now
            </button>
          </>
        )}
      </div>

      {/* Conditionally render the bottom section only for "viaQR" */}
      {selectedUPIMethod === "viaQR" && (
        <div className="flex flex-col gap-2 sm:gap-4 mx-2 sm:mx-14">
          <input
            type="file"
            className="w-full px-3 py-2 sm:px-4 sm:py-4 border rounded-md"
          />
          <input
            type="text"
            placeholder="Enter UTR Number"
            className="w-full px-3 py-2 sm:px-4 sm:py-4 border rounded-md"
          />
          <button
            onClick={() => navigate("/payment-done")}
            className="w-full py-3 sm:py-4 bg-yellow-400 text-white rounded-md font-semibold"
          >
            Submit Now
          </button>
        </div>
      )}
    </div>
  );
}

export default UPIMethod;