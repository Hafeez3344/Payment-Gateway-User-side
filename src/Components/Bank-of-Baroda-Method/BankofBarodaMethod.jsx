import React from "react";
import { useNavigate } from "react-router-dom";
import Qrcode from "../../assets/Qrcode.png";

function BankMethod({ bankName, accountHolder, accountNumber, iban }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-tr-md rounded-br-md p-8">
      <p className="text-xl sm:text-3xl font-bold mb-4 ml-2 sm:ml-4 text-center sm:text-left">
        Scan to Pay
      </p>
      <img
        src={Qrcode}
        alt="QR Code"
        className="w-16 sm:w-20 lg:w-32 mx-auto pl-4 sm:mx-0 mb-4"
      />
      <div className="font-bold text-sm sm:text-base ml-2 sm:ml-4 mb-4">
        <p className="mb-2">
          Bank Name: <span>{bankName}</span>
        </p>
        <p>Account Holder Name: {accountHolder}</p>
        <p>Account Number: {accountNumber}</p>
        <p>IBAN: {iban}</p>
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 mx-2 sm:m-14">
        <input
          type="file"
          className="w-full px-3 py-2 sm:px-4 sm:py-4 border rounded-md"
        />
        <input
          type="text"
          placeholder="Enter Transaction ID"
          className="w-full px-3 py-2 sm:px-4 sm:py-4 border rounded-md"
        />
        <button
        onClick={() => navigate("/")}
          className="w-full py-3 sm:py-4 bg-yellow-400 text-white rounded-md font-semibold"
        >
          Submit Now
        </button>
      </div>
    </div>
  );
}

export default BankMethod;
