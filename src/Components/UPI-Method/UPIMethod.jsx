import React, { useState } from "react";
import Qrcode from "../../assets/Qrcode.svg";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import attention from "../../assets/attention.gif";
import cloudupload from "../../assets/cloudupload.svg";

import { createWorker } from 'tesseract.js';
import { fn_uploadTransactionApi } from "../../api/api";

function UPIMethod({ setTransactionId, selectedUPIMethod = "viaQR", bank, amount, tax, total }) {
  const navigate = useNavigate();
  const [utr, setUtr] = useState('');
  const [imageLoader, setImageLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkBox, setCheckBox] = useState(false);

  const fn_selectImage = async (e) => {
    const worker = await createWorker('eng');
    setSelectedImage(e?.target?.files?.[0]);
    setImageLoader(true);
    const ret = await worker.recognize(e?.target?.files?.[0]);
    const paragraphLines = ret?.data?.paragraphs?.[0]?.lines;
    console.log(paragraphLines)
    const data = paragraphLines?.filter(text => {
      const lowerText = text?.text?.toLowerCase();
      const hasKeyword = ['id'].some(keyword =>
        lowerText.includes(keyword)
      );
      const hasNumber = /\d/.test(text?.text);
      return hasKeyword && hasNumber;
    }).map(text => text.text);
    setImageLoader(false);
    const string = data?.[0];
    const regex = /\d+/g;
    const matches = string.match(regex);
    const longNumbers = matches ? matches.find(num => num.length > 8) : [];
    if (longNumbers) {
      setUtr(longNumbers);
    }
    await worker.terminate();
  };

  const fn_QRsubmit = async () => {
    if (!selectedImage) return alert("Upload Transaction Slip");
    if (utr === "") return alert("Enter UTR Number");
    if(!checkBox) return alert("Verify the Uploaded Receipt Checkbox");
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('utr', utr);
    formData.append('amount', amount);
    formData.append('tax', tax);
    formData.append('total', total);
    formData.append('website', window.location.origin);
    formData.append('bankId', bank?._id);
    const response = await fn_uploadTransactionApi(formData);
    if (response?.status) {
      if (response?.data?.status === "ok") {
        setUtr('');
        setSelectedImage({});
        setTransactionId(response?.data?.data?._id);
        navigate("/payment-done");
      } else {
        alert(response?.message || "Something Went Wrong");
      }
    } else {
      alert(response?.message || "Something Went Wrong");
    }
  }

  return (
    <div className="rounded-tr-md rounded-br-md  flex flex-col">
      {/* first-section */}
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
                    ₹{total}
                  </span>
                </p>
                <p className="text-[15px]">
                  <span className="font-[500]">UPI ID:</span>{" "}
                  {bank?.iban}
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
                className="cursor-pointer hidden "
                onChange={(e) => fn_selectImage(e)}
              />
              <div className="px-3 py-2 sm:px-4 h-[45px] border border-black rounded-md cursor-pointer flex items-center justify-center text-gray-700 ">
                <img src={cloudupload} alt="Upload" className="w-5 h-5 mr-2" />
                <span className="text-gray-400 font-[400]">Upload File</span>
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
                colors={['#000000', '#000000', '#000000', '#000000', '#000000']}
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
            <input type="checkbox" id="check-box" onChange={(e) => setCheckBox(e.target.checked)} />
            <label htmlFor="check-box" className="text-[14px] font-[500] cursor-pointer">This is autofill UTR from Your Uploaded Receipt, verify it.</label>
          </div>
          <button
            onClick={fn_QRsubmit}
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
