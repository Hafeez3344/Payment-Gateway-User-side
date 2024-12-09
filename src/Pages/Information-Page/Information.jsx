import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Information = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("0");
  const [total, setTotal] = useState("");
  const fn_submit = (e) => {
    e.preventDefault();
    console.log("username ", username);
    console.log("amount ", amount);
    console.log("tax ", tax);
    console.log("total ", total);
    navigate(`/payment?amount=${amount}&tax=${tax}&total=${total}`);
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-[28px] font-semibold text-gray-800">
            Information Form
          </h2>
          <p className="text-gray-600 mt-2">
            Please fill in the details below to submit your information.
          </p>
        </div>
        <form className="space-y-4" onSubmit={fn_submit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount:
            </label>
            <input
              type="number"
              step="0.01"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              name="amount"
              placeholder="Amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tax"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tax:
            </label>
            <input
              type="number"
              disabled
              step="0.01"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              name="tax"
              placeholder="Tax"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="total"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Total:
            </label>
            <input
              type="number"
              name="total"
              value={total}
              min={1}
              step={"0.01"}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="Total"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Information;
