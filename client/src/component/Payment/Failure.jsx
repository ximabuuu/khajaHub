import { Home, RefreshCw, XCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-red-500 to-red-600 w-full"></div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-red-100 p-4 rounded-full mb-5">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 text-center">Payment Failed</h1>

            <div className="h-1 w-16 bg-red-500 my-3 rounded-full"></div>

            <p className="text-gray-600 text-center mt-2">
              There was an issue processing your payment. Please try again or contact support.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition duration-200 shadow-sm"
            >
              <Home className="h-4 w-4" />
              Return to Homepage
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-500">
            Need help? <span className="text-red-500 font-medium">Contact our support team</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Failure;
