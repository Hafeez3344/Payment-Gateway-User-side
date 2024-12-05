import CryptoJS from 'crypto-js';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../../Layout/Layout";
import UPIMethod from "../../Components/UPI-Method/UPIMethod";
import { BACKEND_URL, fn_getBanksByTabApi } from "../../api/api";
import OrderSummary from "../../Components/OrderSummary/OrderSummary";

import viaQr from "../../assets/viaQr.svg";
import arrow from "../../assets/arrow.svg";
import Qrcode from "../../assets/Qrcode.svg";
import upilogo from "../../assets/upilogo.png";
import banklogo from "../../assets/banklogo.svg";
import attention from "../../assets/attention.gif";
import cloudupload from "../../assets/cloudupload.svg";

function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bank, setBank] = useState({});
  const secretKey = 'payment-gateway-project';
  const searchParams = new URLSearchParams(location.search);
  const [oneTimeEncryption, setOneTimeEncryption] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [selectedUPIMethod, setSelectedUPIMethod] = useState("viaQR");

  const [originalTax, setOriginalTax] = useState('');
  const [originalTotal, setOriginalTotal] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');

  const decrypt = (encryptedValue) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const amount = searchParams.get('amount');
    const tax = searchParams.get('tax');
    const total = searchParams.get('total');

    const isValidNumber = (value) => /^\d+(\.\d+)?$/.test(value);

    let decryptedAmount = decrypt(amount);
    let decryptedTax = decrypt(tax);
    let decryptedTotal = decrypt(total);

    if (!decryptedAmount || !isValidNumber(decryptedAmount)) {
      decryptedAmount = amount;
    }
    if (!decryptedTax || !isValidNumber(decryptedTax)) {
      decryptedTax = tax;
    }
    if (!decryptedTotal || !isValidNumber(decryptedTotal)) {
      decryptedTotal = total;
    }

    if (decryptedAmount && decryptedTax && decryptedTotal) {
      setOriginalAmount(decryptedAmount);
      setOriginalTax(decryptedTax);
      setOriginalTotal(decryptedTotal);

      if (!oneTimeEncryption) {
        const encryptedAmount = CryptoJS.AES.encrypt(decryptedAmount, secretKey).toString();
        const encryptedTax = CryptoJS.AES.encrypt(decryptedTax, secretKey).toString();
        const encryptedTotal = CryptoJS.AES.encrypt(decryptedTotal, secretKey).toString();

        const encryptedParams = new URLSearchParams();
        encryptedParams.set('amount', encryptedAmount);
        encryptedParams.set('tax', encryptedTax);
        encryptedParams.set('total', encryptedTotal);

        navigate(`?${encryptedParams.toString()}`, { replace: true });
        setOneTimeEncryption(true);
      }
    }
  }, [location.search, navigate, oneTimeEncryption, secretKey]);

  useEffect(() => {
    window.scroll(0, 0);
    fn_getBanks(selectedMethod.toLowerCase());
  }, [selectedMethod]);

  const fn_getBanks = async (tab) => {
    const response = await fn_getBanksByTabApi(tab);
    if (response?.status) {
      setBank(response?.data?.[0]);
    } else {
      setBank({});
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[1200px] mx-auto my-[30px] md:my-[100px] sm:my-[60px] px-4 sm:px-0 md:scale-[0.9]">
        <main className="flex flex-col-reverse lg:flex-row gap-[60px] md:gap-2">
          <div className="w-full lg:w-[70%] max-w-[1000px] bg-white sm:px-6 lg:pe-[40px]">
            {/* tabs */}
            <div className="flex flex-col sm:flex-row mb-8 sm:mb-12">
              <div
                onClick={() => setSelectedMethod("UPI")}
                className={`w-full sm:w-1/2 sm:max-w-[400px] p-3 sm:p-4 ${selectedMethod === "UPI"
                  ? "outline outline-[2px] outline-[--main]"
                  : "outline outline-[1px] outline-r-0 outline-[--secondary]"
                  } flex items-center justify-center cursor-pointer h-28 sm:h-28 lg:h-48 rounded-none lg:rounded-l-[10px]`}
              >
                <img
                  src={upilogo}
                  alt="UPI Logo"
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-52 lg:h-52 object-contain"
                />
              </div>
              <div
                onClick={() => setSelectedMethod("Bank")}
                className={`w-full sm:w-1/2 p-3 sm:p-4 ${selectedMethod === "Bank"
                  ? "outline outline-[2px] outline-[--main]"
                  : "outline outline-[1px] outline-r-0 outline-[--secondary]"
                  } flex items-center justify-center cursor-pointer h-28 sm:h-28 lg:h-48 rounded-none lg:rounded-r-[10px]`}
              >
                <img
                  src={banklogo}
                  alt="Bank Transfer Logo"
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-60 lg:h-60 object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:min-h-[700px]">
              {/* Sidebar */}
              <div className="w-full sm:w-1/3 bg-[--grayBg] border border-[--secondary] flex flex-col gap-2">
                {selectedMethod === "UPI" ? (
                  <div>
                    <div
                      onClick={() => setSelectedUPIMethod("viaQR")}
                      className={`p-2 border-l-[6px] flex items-center gap-2 cursor-pointer ${selectedUPIMethod === "viaQR"
                        ? "bg-white border-[--main] text-black"
                        : "bg-[--grayBg] border-[gray-900] text-gray-700"
                        }`}
                    >
                      <img src={viaQr} alt="Via QR" className="w-8 h-8" />
                      <p className="font-bold text-[19px]">UPI</p>
                      <span className="text-[18px] mt-[1px]">(via QR Scan)</span>
                    </div>

                    <div className="border-t-2 border-b-2 border-gray-300">
                      <div
                        onClick={() => setSelectedUPIMethod("viaApp")}
                        className={`p-2  border-l-[6px] flex  gap-2 cursor-pointer ${selectedUPIMethod === "viaApp"
                          ? "bg-white border-[--main] "
                          : "bg-[--grayBg] border-[gray-900]"
                          }`}
                      >
                        <img src={arrow} alt="Arrow" className="w-8 h-8" />
                        <p className="font-bold text-[19px]">UPI</p>
                        <span className="text-[18px] mt-[1px]">(via UPI App)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      onClick={() => setSelectedBankMethod("Bank of Baroda")}
                      className={`flex gap-1 cursor-pointer bg-white border-l-[6px] border-l-[--bred] text-black border-b-2 border-gray-300`}
                    >
                      <img
                        className="w-12 h-12 ml-1"
                        src={`${BACKEND_URL}/${bank?.image}`}
                        alt="Bank of Baroda logo"
                      />
                      <p className=" text-[19px] font-[700] pt-2">
                        {bank?.bankName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Form Section */}
              <div className="w-full sm:w-2/3 border rounded-r-[10px] px-[1.7rem] py-[1.3rem]">
                {selectedMethod === "UPI" ? (
                  <UPIMethod selectedUPIMethod={selectedUPIMethod} bank={bank} amount={originalAmount} tax={originalTax} total={originalTotal} />
                ) : (
                  <div className="rounded-tr-md rounded-br-md flex flex-col">
                    <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
                      Scan to Pay
                    </p>
                    <img
                      src={Qrcode}
                      alt="QR Code"
                      className="w-[95px] sm:w-[110px] mb-4"
                    />
                    <div className="text-sm sm:text-base font-roboto mb-4 mt-9">
                      <div className="grid grid-cols-2 gap-y-1 text-[17px] sm:text-[23px] font-[700] text-gray-700">
                        <span className="text-[16px] font-[700] text-gray-700">
                          Bank Name:
                        </span>
                        <span className="text-[16px]">
                          {bank?.bankName}
                        </span>

                        <span className="text-[16px] font-[700] text-gray-700">
                          Account Holder Name:
                        </span>
                        <span className="text-[16px]">
                          {bank?.accountHolderName}
                        </span>

                        <span className="text-[16px] font-[700] text-gray-700">
                          Account Number:
                        </span>
                        <span className="text-[16px]">
                          {bank?.accountNo}
                        </span>

                        <span className="text-[16px] font-[700] text-gray-700">
                          IBAN:
                        </span>
                        <span className="text-[16px] break-words">
                          {bank?.iban}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-1 mb-4">
                      <img
                        src={attention}
                        alt="Attention Sign"
                        className="w-12 sm:w-16 lg:w-24 -ml-5"
                      />
                      <p className="italic text-gray-500 -ml-8">
                        After transfer the payment in above bank <br /> please
                        attach the receipt below.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex gap-3 items-center">
                        <label className="w-[150px]">
                          <input
                            type="file"
                            className="cursor-pointer hidden"
                          />
                          <div className="px-3 py-2 sm:px-4 h-[45px] rounded-md cursor-pointer flex items-center justify-center text-gray-700 border border-black">
                            <img
                              src={cloudupload}
                              alt="Upload"
                              className="w-5 h-5 mr-2"
                            />
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
                        onClick={() => navigate("/payment-cancel")}
                        className="w-full bg-[--main] font-[500] text-[15px] h-[45px] text-white rounded-md"
                      >
                        Submit Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section (30%) - Order Summary */}
          <div className="w-full lg:w-[30%] bg-white text-gray-400 sm:px-6 lg:pr-0 lg:ps-6 lg:border-l-2 border-l-2-[--secondary]">
            <OrderSummary amount={parseFloat(originalAmount)} tax={parseFloat(originalTax)} subtotal={parseFloat(originalTotal)} />
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default MainPage;
