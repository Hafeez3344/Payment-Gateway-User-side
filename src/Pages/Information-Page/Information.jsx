import React, { useState } from "react";

const Information = () => {
  const [siteURL, setSiteURL] = useState("");
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const fn_submit = (e) => {
    e.preventDefault();
    // window.location.href = `https://www.royal247.org/payment?username=${username}&amount=${amount}`;
    window.location.href = `/payment?username=${username}&amount=${amount}&type=direct&site=${siteURL}`;
  };
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
              htmlFor="siteURL"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Site URL:
            </label>
            <input
              type="text"
              value={siteURL}
              onChange={(e) => setSiteURL(e.target.value)}
              name="siteURL"
              placeholder="Enter Website URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
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
