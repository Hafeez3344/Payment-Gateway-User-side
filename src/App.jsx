import "./app.css";

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import MainPage from "./Pages/Main-Page/MainPage";
import PaymentDone from "./Pages/Payment-Done/PaymentDone";
import PaymentCancel from "./Pages/Payment-Cancel/PaymentCancel";
import WaitingforUPIApproval from "./Pages/Waiting-for-UPI-Approval/WaitingforUPIApproval";

function App() {
  const [transactionId, setTransactionId] = useState("");
  return (
    <>

      <Routes>
        <Route path="/" element={<MainPage setTransactionId={setTransactionId} />} />
        <Route path="/payment-done" element={<PaymentDone transactionId={transactionId} />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/waiting-for-upi-approval" element={<WaitingforUPIApproval/>} />
      </Routes>
    </>
  );
}

export default App;
