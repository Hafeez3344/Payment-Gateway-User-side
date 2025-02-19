import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import attention from "../../assets/attention.gif";
import cloudupload from "../../assets/cloudupload.svg";
import { Modal } from "antd";
import cancel from "../../assets/cancel.gif";
import AnimationTickmarck from "../../assets/AnimationTickmarck.gif";

import { createWorker } from "tesseract.js";
import { BACKEND_URL, fn_uploadTransactionApi } from "../../api/api";
import { FaRegCopy } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { IoCamera } from "react-icons/io5";
import { io } from "socket.io-client";

const socket = io(`${BACKEND_URL}/payment`); // Update with your backend URL

function UPIMethod({
  setTransactionId,
  selectedUPIMethod = "viaQR",
  bank,
  amount,
  tax,
  total,
  username,
  type,
  site,
}) {
  const navigate = useNavigate();
  const [utr, setUtr] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processingError, setProcessingError] = useState("");
  const [copyURL, setCopyUPI] = useState(false);
  const [isDuplicateModal, setIsDuplicateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({});

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

  const handleCameraCapture = async (e) => {
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
      const specificText = allLines.filter((line) => {
        return line.text?.split(/\s+/).some((word) => {
          const isValidWord = /^(?=.*\d)[a-zA-Z0-9#]+$/.test(word);
          return isValidWord && word.length > 7;
        });
      });

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

  const fn_QRsubmit = async () => {
    if (!selectedImage) return alert("Upload Transaction Slip");
    if (utr === "") return alert("Enter UTR Number");
    if (!checkBox) return alert("Verify the Uploaded Receipt Checkbox");

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("utr", utr);
    formData.append("amount", amount);
    formData.append("tax", tax);
    formData.append("total", total);
    formData.append("website", window.location.origin);
    formData.append("bankId", bank?._id);
    if (type && site) {
      formData.append("type", type);
      formData.append("site", site);
    } else {
      formData.append("type", "manual");
    }

    const response = await fn_uploadTransactionApi(formData, username);
    if (response?.status) {
      if (response?.data?.status === "ok") {

        socket.emit('addLedger',{id:response?.data?.data?._id})


        setTransactionId(response?.data?.data?.trnNo);

        if (type === "direct") {
          // For direct payments, show modal and wait 2 seconds
          setSuccessData({
            transactionId: response?.data?.data?.trnNo,
            message: encodeURIComponent(
              `Username: ${username}\nTransaction ID: ${response?.data?.data?.trnNo}\nWebsite: ${site}\nAmount: ${amount}\nUTR: ${utr}`
            ),
            phone: localStorage.getItem("phone")
          });
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${localStorage.getItem("phone")}&text=${encodeURIComponent(
              `Username: ${username}\nTransaction ID: ${response?.data?.data?.trnNo}\nWebsite: ${site}\nAmount: ${amount}\nUTR: ${utr}`
            )}`;
            window.location.href = whatsappUrl;
          }, 2000);
        } else {
          // For non-direct payments, redirect immediately without modal
          navigate("/payment-done", {
            state: {
              transactionId: response?.data?.data?.trnNo,
              amount,
              username,
              site,
              utr
            }
          });
        }

        setUtr("");
        setSelectedImage({});
      } else if (response?.message?.toLowerCase().includes("unique utr")) {
        setIsDuplicateModal(true);
      } else {
        alert(response?.message || "Something Went Wrong");
      }
    } else if (response?.message?.toLowerCase().includes("unique utr")) {
      setIsDuplicateModal(true);
    } else {
      alert(response?.message || "Something Went Wrong");
    }
  };

  useEffect(() => {
    if (copyURL) {
      setTimeout(() => setCopyUPI(false), 1000);
    }
  }, [copyURL]);

  const fn_copyURL = (text) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopyUPI(true);
        })
        .catch((err) => {
          console.error("Failed to copy text:", err);
        });
    }
  };

  return (
    <>
      <div className="rounded-tr-md rounded-br-md  flex flex-col">
        {/* first-section */}
        {/* <div className="flex flex-col items-start">
        {selectedUPIMethod === "viaQR" ? (
          <div>
            {bank?.image ? (
              <>
                <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
                  Scan to Pay
                </p>
                <div className="flex gap-[30px] items-center">
                  <img
                    src={`${BACKEND_URL}/${bank?.image}`}
                    alt="QR Code"
                    className="w-[95px] sm:w-[110px]"
                  />
                  <div className="mb-4">
                    <p className="mb-1 flex items-center gap-[4px]">
                      <span className="text-[16px] font-[700]">Scan and Pay</span>{" "}
                      <span className="text-[17px] font-[700] text-[--main] mb-[-2px]">
                        ₹{total}
                      </span>
                    </p>
                    <p className="text-[15px]">
                      <span className="font-[500]">UPI ID:</span> {bank?.iban}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
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
          <div className="flex flex-col items-center sm:items-start justify-center w-full">
            <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
              Scan to Pay
            </p>
            <input
              type="text"
              placeholder="Enter UPI ID"
              className="w-[300px] sm:w-[450px] h-[45px] border px-[20px] rounded-md focus:outline-none text-[14px] mb-4"
            />
            <button
              onClick={() => navigate("/waiting-for-upi-approval")}
              className="w-[300px] sm:w-[450px] bg-[--main] font-[500] text-[15px] h-[45px] text-white rounded-md"
            >
              Pay Now
            </button>
          </div>
        )}
      </div> */}
        <div className="flex flex-col items-start">
          {selectedUPIMethod === "viaQR" ? (
            <div>
              {bank?.image ? (
                <>
                  <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
                    Scan to Pay
                  </p>
                  <div className="flex sm:flex-row flex-col gap-[30px] items-center sm:items-center w-full">
                    <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                      <img
                        src={`${BACKEND_URL}/${bank?.image}`}
                        alt="QR Code"
                        className="w-full sm:w-[150px]"
                      />
                    </div>
                    <div className="mb-2 sm:mb-4 text-center sm:text-left">
                      <p className="mb-1 flex items-center justify-center sm:justify-start gap-[4px]">
                        <span className="text-[16px] font-[700]">
                          Scan and Pay
                        </span>{" "}
                        <span className="text-[17px] font-[700] text-[--main] mb-[-2px]">
                          ₹{total}
                        </span>
                      </p>
                      <p className="text-[15px]">
                        <span className="font-[500]">UPI ID:</span> {bank?.iban}
                        {!copyURL ? (
                          <FaRegCopy
                            className="inline-block mt-[-2px] ms-[15px] cursor-pointer"
                            onClick={() => fn_copyURL(bank?.iban)}
                          />
                        ) : (
                          <TiTick className="inline-block mt-[-2px] ms-[15px] scale-[1.2] cursor-pointer" />
                        )}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <p className="mb-1 flex items-center gap-[4px]">
                    <span className="text-[16px] font-[700]">Pay</span>{" "}
                    <span className="text-[17px] font-[700] text-[--main] mb-[-2px]">
                      ₹{total}
                    </span>
                  </p>
                  <p className="text-[15px]">
                    <span className="font-[500]">UPI ID:</span> {bank?.iban}
                  </p>
                </div>
              )}
              <div
                className={`flex items-center ${bank?.image ? "my-[18px]" : "-mt-[17px] mb-[16px]"
                  }`}
              >
                <img
                  src={attention}
                  alt="Attention Sign"
                  className="w-16 lg:w-[90px] mb-2 sm:mb-0 ml-[-22px]"
                />
                <p className="italic text-gray-500 text-[15px] mt-[-8px] sm:mt-0">
                  After transfer the payment in the UPI <br /> Account, please
                  attach the receipt below.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center sm:items-start justify-center w-full">
              <p className="text-[17px] sm:text-[23px] font-[700] mb-[1.2rem] text-center sm:text-left">
                Scan to Pay
              </p>
              <input
                type="text"
                placeholder="Enter UPI ID"
                className="w-[300px] sm:w-[450px] h-[45px] border px-[20px] rounded-md focus:outline-none text-[14px] mb-4"
              />
              <button
                onClick={() => navigate("/waiting-for-upi-approval")}
                className="w-[300px] sm:w-[450px] bg-[--main] font-[500] text-[15px] h-[45px] text-white rounded-md"
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
        {/* second section */}
        {selectedUPIMethod === "viaQR" && (
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex gap-3 items-center">
              <label className="w-[150px]">
                <input
                  type="file"
                  className="cursor-pointer hidden"
                  onChange={(e) => fn_selectImage(e)}
                />
                <div className="px-2 sm:px-3 py-1 sm:py-2 h-[35px] sm:h-[45px] border border-black rounded-md cursor-pointer flex items-center justify-center text-gray-700 w-[120px] sm:w-auto">
                  <img
                    src={cloudupload}
                    alt="Upload"
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                  />
                  <span className="text-gray-400 text-sm sm:text-base font-[400] text-nowrap">
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
                  colors={["#000000", "#000000", "#000000", "#000000", "#000000"]}
                />
              )}
            </div>
            <label className="flex sm:hidden" onClick={() => alert("Coming Soon")}>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraCapture}
                disabled
              />
              <div className="px-2 sm:px-3 py-1 sm:py-2 h-[35px] sm:h-[45px] border border-black rounded-md cursor-pointer items-center justify-center text-gray-700 w-full sm:w-auto flex">
                <IoCamera className="scale-[1.3] me-[10px]" />
                <span className="text-gray-400 text-sm sm:text-base font-[400] text-nowrap">
                  Capture Image
                </span>
              </div>
            </label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="Enter UTR Number."
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
                This is autofill UTR from Your Uploaded Receipt, verify it.
              </label>
            </div>
            <button
              onClick={fn_QRsubmit}
              className="w-full bg-[--main] font-[500] text-[15px] h-[45px] text-white rounded-md"
            >
              Submit Now
            </button>
          </div>
        )}
        <Modal
          title="Duplicate Transaction"
          open={isDuplicateModal}
          onOk={() => setIsDuplicateModal(false)}
          onCancel={() => setIsDuplicateModal(false)}
          centered
        >
          <div className="py-4 flex flex-col items-center">
            {/* Cancel Animation */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-500 rounded-full p-2">
                <img
                  src={cancel}
                  alt="Cancel Icon"
                  className="w-24 sm:w-28 h-24 sm:h-28 object-contain"
                />
              </div>
            </div>

            {/* Error Message */}
            <p className="text-xl font-bold text-gray-800 mb-4">
              OOPS! Duplicate UTR
            </p>
            <p className="text-red-500 font-medium text-center">
              This UTR number has already been used!
            </p>
            <p className="mt-2 text-gray-500 text-center">
              Please enter a unique UTR number for your transaction.
            </p>
          </div>
        </Modal>
      </div>
      {/* Success Modal */}
      <Modal
        title="Payment Successful"
        open={showSuccessModal}
        footer={null}
        closable={false}
        maskClosable={false}
        centered
      >
        <div className="py-4 flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <img
              src={AnimationTickmarck}
              alt="Success"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-green-600 mb-2">
            Payment Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Transaction ID: {successData.transactionId}
          </p>
          <p className="text-gray-500 text-center">
            {type === "direct" ? "Redirecting to WhatsApp..." : "Redirecting..."}
          </p>
        </div>
      </Modal>
    </>
  );
}

export default UPIMethod;
