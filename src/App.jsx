import { Routes, Route } from "react-router-dom";
import MainPage from "./Pages/Main-Page/MainPage";
import WaitingforUPIApproval from "./Pages/Waiting-for-UPI-Approval/WaitingforUPIApproval";
import PaymentDone from "./Pages/Payment-Done/PaymentDone";
import PaymentCancel from "./Pages/Payment-Cancel/PaymentCancel";

function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/payment-done" element={<PaymentDone />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/waiting-for-upi-approval" element={<WaitingforUPIApproval/>} />
      </Routes>
    </>
  );
}

export default App;
