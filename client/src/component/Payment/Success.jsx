import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import axios from "axios";
import Axios from "../../utils/axios";
import SummaryApi from "../../config/summaryApi.js";
import { useGlobalContext } from "../../global/globalFunc"; 

const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, clearCartSuccess } = useGlobalContext();

  // Get token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");

  let decoded = null;
  if (token) {
    try {
      decoded = base64Decode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const verifyPaymentAndUpdateStatus = async () => {
    if (!decoded || !decoded.transaction_uuid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await Axios.post(SummaryApi.esewaStatus.url,
        { product_id: decoded.transaction_uuid }
      );

      if (response.status === 200) {
        setIsSuccess(true);
        clearCart()
        await clearCartSuccess() // Clear the cart after successful payment
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyPaymentAndUpdateStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      {isLoading ? (
        <div className="text-lg text-gray-600">Loading...</div>
      ) : isSuccess ? (
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold text-green-600">Payment Successful! 🎉</h1>
          <p className="text-gray-700 mt-2">
            Thank you for your payment. Your transaction was successful.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Go to Homepage
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold text-red-600">Oops!.. Payment Failed ❌</h1>
          <p className="text-gray-700 mt-2">We will resolve it soon.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Go to Homepage
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;
