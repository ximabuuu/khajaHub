import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import axios from "axios";
import Axios from "../../utils/axios";
import SummaryApi from "../../config/SummaryApi.js";
import { useGlobalContext } from "../../global/globalFunc";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gray-50">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
          <div className="text-lg font-medium text-gray-700">Processing your payment...</div>
          <p className="text-gray-500 mt-2 text-sm">This may take a few moments</p>
        </div>
      ) : isSuccess ? (
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Successful! 🎉</h1>
            <p className="text-gray-600 mt-3 mb-6 max-w-xs">
              Thank you for your payment. Your transaction was successful.
            </p>
            <div className="w-full pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/")}
                className="w-full mt-2 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition font-medium shadow-sm"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
            <p className="text-gray-600 mt-3 mb-6 max-w-xs">
              We couldn't process your payment. We will resolve it soon.
            </p>
            <div className="w-full pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate("/")}
                className="w-full mt-2 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition font-medium shadow-sm"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
