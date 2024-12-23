import CryptoJS from "crypto-js";
import { createWorker } from "tesseract.js";
import { ColorRing } from "react-loader-spinner";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Layout from "../../Layout/Layout";
import UPIMethod from "../../Components/UPI-Method/UPIMethod";
import OrderSummary from "../../Components/OrderSummary/OrderSummary";
import {
  BACKEND_URL,
  fn_getBanksByTabApi,
  fn_getWebInfoApi,
  fn_uploadTransactionApi,
} from "../../api/api";
import { Banks } from "../../json-data/banks";

import viaQr from "../../assets/viaQr.svg";
import arrow from "../../assets/arrow.svg";
import Qrcode from "../../assets/Qrcode.svg";
import upilogo from "../../assets/upilogo.png";
import banklogo from "../../assets/banklogo.svg";
import attention from "../../assets/attention.gif";
import cloudupload from "../../assets/cloudupload.svg";
import { FaExclamationCircle } from "react-icons/fa";

function MainPage({ setTransactionId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [bank, setBank] = useState({});
  const secretKey = "payment-gateway-project";
  const searchParams = new URLSearchParams(location.search);
  const [oneTimeEncryption, setOneTimeEncryption] = useState(false);
  const [webInfo, setWebInfo] = useState({});

  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [selectedUPIMethod, setSelectedUPIMethod] = useState("viaQR");

  const [originalTax, setOriginalTax] = useState("");
  const [originalTotal, setOriginalTotal] = useState("");
  const [originalAmount, setOriginalAmount] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");

  const [utr, setUtr] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingError, setProcessingError] = useState("");

  const decrypt = (encryptedValue) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const amount = searchParams.get("amount");
    const username = searchParams.get("username");

    const isValidNumber = (value) => /^\d+(\.\d+)?$/.test(value);
    let decryptedAmount = decrypt(amount);

    if (!decryptedAmount || !isValidNumber(decryptedAmount)) {
      decryptedAmount = amount;
    }

    if (decryptedAmount) {
      setOriginalAmount(decryptedAmount);
      setOriginalUsername(username);

      if (!oneTimeEncryption) {
        const encryptedAmount = CryptoJS.AES.encrypt(
          decryptedAmount,
          secretKey
        ).toString();
        const encryptedParams = new URLSearchParams();
        encryptedParams.set("amount", encryptedAmount);
        encryptedParams.set("username", username);
        navigate(`?${encryptedParams.toString()}`, { replace: true });
        setOneTimeEncryption(true);
      }
    }
  }, [location.search, navigate, oneTimeEncryption]);

  useEffect(() => {
    window.scroll(0, 0);
    setCheckBox(false);
    fn_getBanks(selectedMethod.toLowerCase());
    fn_getWebInfo();
  }, [selectedMethod]);

  const fn_getBanks = async (tab) => {
    const response = await fn_getBanksByTabApi(tab);
    if (response?.status) {
      setBank(response?.data?.[0] || {});
    } else {
      setBank({});
    }
  };

  const fn_getWebInfo = async () => {
    const response = await fn_getWebInfoApi();
    if (response?.status) {
      setWebInfo(response?.data || {});
    } else {
      setBank({});
    }
  };

  const fn_selectImage = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setImageLoader(true);
    setProcessingError("");
    setUtr("");

    const worker = await createWorker("eng");

    try {
      const ret = await worker.recognize(file);

      const allLines = ret?.data?.lines || [];
      console.log("lines ", allLines);

      const specificText = allLines.filter((line) => {
        return line.text?.split(/\s+/).some((word) => {
          const isValidWord = /^(?=.*\d)[a-zA-Z0-9#]+$/.test(word);
          return isValidWord && word.length > 7;
        });
      });

      console.log("specificText", specificText);

      const mostSpecificText = specificText
        .map((text) => {
          const matchedWord = text?.words?.find((word) => {
            const wordText = word?.text || "";
            const isAlphanumeric = /^(?=.*\d)[a-zA-Z0-9#]+$/.test(wordText);
            return isAlphanumeric && wordText.length > 7;
          });
          return matchedWord || null;
        })
        .filter(Boolean);
      console.log("mostSpecificText ", mostSpecificText?.[0]?.text || null);
      const autoUTR = mostSpecificText?.[0]?.text || "";
      setUtr(autoUTR);
    } catch (error) {
      console.error("Receipt processing error:", error);
      setProcessingError(
        "Error processing receipt. Please enter UTR manually."
      );
    } finally {
      setImageLoader(false);
      await worker.terminate();
    }
  };

  const fn_Banksubmit = async () => {
    if (!selectedImage) {
      alert("Upload Transaction Slip");
      return;
    }
    if (utr === "") {
      alert("Enter UTR Number");
      return;
    }
    if (!checkBox) {
      alert("Verify the Uploaded Receipt Checkbox");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("utr", utr);
    formData.append("amount", originalAmount);
    formData.append("tax", webInfo?.tax || 0);
    formData.append(
      "total",
      (
        (originalAmount / 100) * (webInfo?.tax || 0) +
        parseFloat(originalAmount)
      ).toFixed(1)
    );
    formData.append("website", window.location.origin);
    formData.append("bankId", bank?._id);

    const response = await fn_uploadTransactionApi(formData);
    if (response?.status) {
      if (response?.data?.status === "ok") {
        setUtr("");
        setSelectedImage({});
        setTransactionId(response?.data?.data?.trnNo);
        navigate("/payment-done");
      } else {
        alert(response?.message || "Something Went Wrong");
      }
    } else {
      alert(response?.message || "Something Went Wrong");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-[1200px] mx-auto my-[30px] md:my-[100px] sm:my-[60px] px-4 sm:px-0 md:scale-[0.9]">
        <main className="flex flex-col-reverse lg:flex-row gap-[60px] md:gap-2">
          <div className="w-full lg:w-[70%] max-w-[1000px] bg-white sm:px-6 lg:pe-[40px]">
            {/* Payment method tabs */}
            <div className="flex flex-col sm:flex-row mb-8 sm:mb-12">
              <div
                onClick={() => setSelectedMethod("UPI")}
                className={`w-full sm:w-1/2 sm:max-w-[400px] p-3 sm:p-4 ${
                  selectedMethod === "UPI"
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
                className={`w-full sm:w-1/2 p-3 sm:p-4 ${
                  selectedMethod === "Bank"
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

            {Object.keys(bank).length > 0 ? (
              <div className="flex flex-col sm:flex-row md:min-h-[700px]">
                {/* Sidebar */}
                <div className="w-full sm:w-1/3 bg-[--grayBg] border border-[--secondary] flex flex-col gap-2">
                  {selectedMethod === "UPI" ? (
                    <div>
                      <div
                        onClick={() => setSelectedUPIMethod("viaQR")}
                        className={`p-2 border-l-[6px] flex items-center gap-2 cursor-pointer ${
                          selectedUPIMethod === "viaQR"
                            ? "bg-white border-[--main] text-black"
                            : "bg-[--grayBg] border-[gray-900] text-gray-700"
                        }`}
                      >
                        <img src={viaQr} alt="Via QR" className="w-8 h-8" />
                        <p className="font-bold text-[19px]">UPI</p>
                        <span className="text-[18px] mt-[1px]">
                          (via QR Scan)
                        </span>
                      </div>

                      <div className="border-t-2 border-b-2 border-gray-300">
                        <div
                          onClick={() => setSelectedUPIMethod("viaApp")}
                          className={`p-2 border-l-[6px] flex gap-2 cursor-pointer ${
                            selectedUPIMethod === "viaApp"
                              ? "bg-white border-[--main]"
                              : "bg-[--grayBg] border-[gray-900]"
                          }`}
                        >
                          <img src={arrow} alt="Arrow" className="w-8 h-8" />
                          <p className="font-bold text-[19px]">UPI</p>
                          <span className="text-[18px] mt-[1px]">
                            (via UPI App)
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-1 cursor-pointer bg-white border-l-[6px] border-l-[--bred] text-black border-b-2 border-gray-300">
                        <img
                          className="w-12 h-12 ml-1"
                          src={
                            Banks?.find(
                              (bankItem) =>
                                bankItem?.title?.toLowerCase() ===
                                bank?.bankName?.toLowerCase()
                            )?.img || "https://www.shutterstock.com/image-vector/bank-building-architecture-facade-government-600nw-2440534455.jpg"
                          }
                          alt={`${bank?.bankName || "Bank"} logo`}
                        />
                        <p className="text-[19px] font-[700] pt-2">
                          {bank?.bankName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Form Section */}
                <div className="w-full sm:w-2/3 border rounded-r-[10px] px-[1.7rem] py-[1.3rem]">
                  {selectedMethod === "UPI" ? (
                    <UPIMethod
                      setTransactionId={setTransactionId}
                      selectedUPIMethod={selectedUPIMethod}
                      bank={bank}
                      amount={originalAmount}
                      tax={webInfo?.tax || 0}
                      total={(
                        (originalAmount / 100) * (webInfo?.tax || 0) +
                        parseFloat(originalAmount)
                      ).toFixed(1)}
                    />
                  ) : (
                    <div className="rounded-tr-md rounded-br-md flex flex-col">
                      <p className="text-[17px] sm:text-[23px] font-[700] mb-4 text-center sm:text-left">
                        Scan to Pay
                      </p>
                      <img
                        src={Qrcode}
                        alt="QR Code"
                        className="w-[95px] sm:w-[110px] mb-5"
                      />
                      <div className="text-sm sm:text-base font-roboto mt-1">
                        <div className="grid grid-cols-2 gap-y-1 text-[17px] sm:text-[23px] font-[700] text-gray-700">
                          <span className="text-[16px] font-[700] text-gray-700">
                            Bank Name:
                          </span>
                          <span className="text-[14px] font-[500]">
                            {bank?.bankName}
                          </span>

                          <span className="text-[16px] font-[700] text-gray-700">
                            Account Holder Name:
                          </span>
                          <span className="text-[14px] font-[500]">
                            {bank?.accountHolderName}
                          </span>

                          <span className="text-[16px] font-[700] text-gray-700">
                            Account Number:
                          </span>
                          <span className="text-[14px] font-[500]">
                            {bank?.accountNo}
                          </span>

                          <span className="text-[16px] font-[700] text-gray-700">
                            IBAN:
                          </span>
                          <span className="text-[14px] font-[500] break-words">
                            {bank?.iban}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:space-x-1 mb-2">
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
                              onChange={(e) => fn_selectImage(e)}
                            />
                            <div className="px-3 py-2 sm:px-4 h-[45px] rounded-md cursor-pointer flex items-center justify-center text-gray-700 border border-black">
                              <img
                                src={cloudupload}
                                alt="Upload"
                                className="w-5 h-5 mr-2"
                              />
                              <span className="text-gray-400 font-[400]">
                                Upload File
                              </span>
                            </div>
                          </label>
                          <p className="text-[14px] font-[600]">
                            {!selectedImage ? (
                              <span>Attach transaction slip here</span>
                            ) : (
                              <span>{selectedImage?.name}</span>
                            )}
                          </p>
                          {imageLoader && (
                            <ColorRing
                              visible={true}
                              height="45"
                              width="45"
                              ariaLabel="color-ring-loading"
                              wrapperStyle={{}}
                              wrapperClass="color-ring-wrapper"
                              colors={[
                                "#000000",
                                "#000000",
                                "#000000",
                                "#000000",
                                "#000000",
                              ]}
                            />
                          )}
                        </div>
                        <input
                          type="text"
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          placeholder="Enter UTR Number"
                          className="w-full text-gray-800 font-[400] border border-[--secondary] h-[45px] px-[20px] rounded-md focus:outline-none text-[15px]"
                        />
                        <div className="flex items-center gap-[7px]">
                          <input
                            type="checkbox"
                            id="check-box"
                            onChange={(e) => setCheckBox(e.target.checked)}
                          />
                          <label
                            htmlFor="check-box"
                            className="text-[14px] font-[500] cursor-pointer"
                          >
                            This is autofill UTR from Your Uploaded Receipt,
                            verify it.
                          </label>
                        </div>
                        <button
                          onClick={fn_Banksubmit}
                          className="w-full bg-[--main] font-[500] text-[15px] h-[45px] text-white rounded-md"
                        >
                          Submit Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row md:min-h-[700px]">
                <p className="text-center w-full">
                  <FaExclamationCircle className="inline-block text-[22px] mt-[-3px]" />
                  &nbsp;&nbsp;No {selectedMethod === "UPI" && "UPI"} Bank Added
                </p>
              </div>
            )}
          </div>

          {/* Right Section (30%) - Order Summary */}
          <div className="w-full lg:w-[30%] bg-white text-gray-400 sm:px-6 lg:pr-0 lg:ps-6 lg:border-l-2 border-l-2-[--secondary]">
            <OrderSummary
              amount={parseFloat(originalAmount)}
              tax={parseFloat(originalTax)}
              subtotal={parseFloat(originalTotal)}
              webInfo={webInfo}
            />
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default MainPage;
