import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import upilogo from "../../assets/upilogo.png";
import banklogo from "../../assets/banklogo.png";
import OrderSummary from "../../Components/OrderSummary/OrderSummary";
import viaQr from "../../assets/viaQr.png";
import arrow from "../../assets/arrow.png";
import BankOfBarodaLogo from "../../assets/BankOfBarodaLogo.png";
import UPIMethod from "../../Components/UPI-Method/UPIMethod";
import CanaraBank from "../../assets/CanaraBank.png";
import BankofMaharashtra from "../../assets/BankofMaharashtra.png";
import UCOBank from "../../assets/UCOBank.png";
import Qrcode from "../../assets/Qrcode.png";

function MainPage() {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [selectedUPIMethod, setSelectedUPIMethod] = useState("viaQR");
  const [selectedBankMethod, setSelectedBankMethod] =
    useState("Bank of Baroda");

    const navigate = useNavigate();

  const paymentDetails = {
    UPI: { amount: 1000, tax: 160, subtotal: 1160 },
    Bank: { amount: 950, tax: 140, subtotal: 1090 },
  };

  const bankDetails = {
    "Bank of Baroda": {
      bankName: "Bank of Baroda",
      accountHolder: "Payment Processor LTD",
      accountNumber: "21312489038490",
      iban: "BOB2131248903813490",
    },
    "Canara Bank": {
      bankName: "Canara Bank",
      accountHolder: "Canara Bank Processor",
      accountNumber: "23123984391239",
      iban: "CAN123123981234",
    },
    "Bank of Maharashtra": {
      bankName: "Bank of Maharashtra",
      accountHolder: "Maharashtra Payments",
      accountNumber: "23123984391239",
      iban: "MHA231231231233",
    },
    "UCO Bank": {
      bankName: "UCO Bank",
      accountHolder: "UCO Payments Ltd",
      accountNumber: "87323984391239",
      iban: "UCO831231231233",
    },
  };

  const { amount, tax, subtotal } = paymentDetails[selectedMethod];
  const selectedBank = bankDetails[selectedBankMethod];

  return (
    <Layout>
      <div className="w-full lg:w-4/5 mx-auto my-4 sm:my-10 px-4 sm:px-0">
        <main className="flex flex-col lg:flex-row gap-2">
          <div className="w-full lg:w-[70%] bg-white p-4 sm:p-6 rounded-md">
            <div className="flex flex-col sm:flex-row mb-6 sm:mb-12">
              <div
                onClick={() => setSelectedMethod("UPI")}
                className={`w-[231] h-[113] sm:w-1/2 p-3 sm:p-4 rounded-l-md border ${
                  selectedMethod === "UPI"
                    ? "border-yellow-500"
                    : "border-gray-300"
                } flex items-center justify-center cursor-pointer`}
              >
                <img
                  src={upilogo}
                  alt="UPI Logo"
                  className="w-[115] h-[59] sm:h-20 lg:h-40"
                />
              </div>
              <div
                onClick={() => setSelectedMethod("Bank")}
                className={`w-[231] h-[113] sm:w-1/2 p-3 sm:p-4 rounded-r-md border ${
                  selectedMethod === "Bank"
                    ? "border-yellow-500"
                    : "border-gray-300"
                } flex items-center justify-center cursor-pointer`}
              >
                <img
                  src={banklogo}
                  alt="Bank Transfer Logo"
                  className="w-[115] h-[59] sm:h-20 lg:h-40"
                />
              </div>
            </div>

            {/* Sidebar & Payment Form Section */}
            <div className="flex flex-col sm:flex-row">
              {/* Sidebar - Dynamic Content */}
              <div className="w-full sm:w-1/3 bg-gray-200 border rounded-tl-md rounded-bl-md border-gray-300 p-2 flex flex-col">
                {selectedMethod === "UPI" ? (
                  <div>
                    <div
                      onClick={() => setSelectedUPIMethod("viaQR")}
                      className={`p-5 border-l-8 border flex gap-4 cursor-pointer ${
                        selectedUPIMethod === "viaQR"
                          ? "bg-white border-yellow-400 text-black"
                          : "bg-gray-200 border-white text-gray-700"
                      }`}
                    >
                      <img src={viaQr} alt="Via QR" />
                      <p className="font-bold">UPI (via QR Scan)</p>
                    </div>

                    <div
                      onClick={() => setSelectedUPIMethod("viaApp")}
                      className={`p-5 border-l-8 border  flex gap-4 cursor-pointer ${
                        selectedUPIMethod === "viaApp"
                          ? "bg-white border-yellow-400 text-black"
                          : "bg-gray-200 border-white text-gray-700"
                      }`}
                    >
                      <img src={arrow} alt="Arrow" />
                      <p className="font-bold">UPI (via UPI App)</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      onClick={() => setSelectedBankMethod("Bank of Baroda")}
                      className={`p-2 border-l-8 border flex gap-4 cursor-pointer ${
                        selectedBankMethod === "Bank of Baroda"
                          ? "bg-white border-yellow-400 text-black"
                          : "bg-gray-200 border-white text-gray-700"
                      }`}
                    >
                      <img
                        className="w-12 h-12"
                        src={BankOfBarodaLogo}
                        alt="Bank of Baroda logo"
                      />
                      <p
                        className={`text-gray-700 font-bold items-center flex ${
                          selectedBankMethod === "Bank of Baroda"
                            ? "text-black"
                            : ""
                        }`}
                      >
                        Bank of Baroda
                      </p>
                    </div>
                    <div
                      onClick={() => setSelectedBankMethod("Canara Bank")}
                      className={`p-2 border-l-8 border flex gap-4 cursor-pointer ${
                        selectedBankMethod === "Canara Bank"
                          ? "bg-white border-yellow-400 text-black"
                          : "bg-gray-200 border-white text-gray-700"
                      }`}
                    >
                      <img
                        className="w-12 h-12"
                        src={CanaraBank}
                        alt="Canara Bank logo"
                      />
                      <p
                        className={`text-gray-700 font-bold items-center flex ${
                          selectedBankMethod === "Canara Bank"
                            ? "text-black"
                            : ""
                        }`}
                      >
                        Canara Bank
                      </p>
                    </div>
                    <div
                      onClick={() =>
                        setSelectedBankMethod("Bank of Maharashtra")
                      }
                      className={`p-2 border-l-8 border flex gap-4 cursor-pointer ${
                        selectedBankMethod === "Bank of Maharashtra"
                          ? "bg-white border-yellow-400 text-black"
                          : "bg-gray-200 border-white text-gray-700"
                      }`}
                    >
                      <img
                        className="w-12 h-12"
                        src={BankofMaharashtra}
                        alt="Bank of Maharashtra logo"
                      />
                      <p
                        className={`text-gray-700 font-bold items-center flex ${
                          selectedBankMethod === "Bank of Maharashtra"
                            ? "text-black"
                            : ""
                        }`}
                      >
                        Bank of Maharashtra
                      </p>
                    </div>
                    <div
                      onClick={() => setSelectedBankMethod("UCO Bank")}
                      className={`p-2 border-l-8 border flex gap-4 cursor-pointer ${
                        selectedBankMethod === "UCO Bank"
                          ? "bg-white border-yellow-400 text-black"
                          : "bg-gray-200 border-white text-gray-700"
                      }`}
                    >
                      <img
                        className="w-12 h-12"
                        src={UCOBank}
                        alt="UCO Bank logo"
                      />
                      <p
                        className={`text-gray-700 font-bold items-center flex ${
                          selectedBankMethod === "UCO Bank" ? "text-black" : ""
                        }`}
                      >
                        UCO Bank
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Form Section */}
              <div className="w-full sm:w-2/3 border rounded-tr-md rounded-br-md p-8">
                {selectedMethod === "UPI" ? (
                  <UPIMethod selectedUPIMethod={selectedUPIMethod} />
                ) : (
                  <div>
                    <p className="text-xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
                      Scan to Pay
                    </p>
                    <img
                      src={Qrcode}
                      alt="QR Code"
                      className="w-16 sm:w-20 lg:w-32 mx-auto sm:mx-0 mb-4"
                    />
                    <div className="font-bold text-sm sm:text-base mb-4">
                      <p className="mb-2">
                        Bank Name: <span>{selectedBank.bankName}</span>
                      </p>
                      <p>Account Holder Name: {selectedBank.accountHolder}</p>
                      <p>Account Number: {selectedBank.accountNumber}</p>
                      <p>IBAN: {selectedBank.iban}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-4">
                      <input
                        type="file"
                        className="w-full h-[52px] border rounded-md text-gray-400 px-8"
                      />
                    
                      <button
                        onClick={() => navigate("/payment-done")}
                       className="w-full bg-[#FFD814] rounded-md p-2 sm:p-4 font-bold text-sm sm:text-base">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section (30%) - Order Summary */}
          <div className="w-full lg:w-[30%] bg-white text-gray-400 font-bold p-4 sm:p-6 ">
            <OrderSummary amount={amount} tax={tax} subtotal={subtotal} />
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default MainPage;
