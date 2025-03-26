import React from "react";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-red-600 mb-4">Payment Failed!</h1>
        <p className="text-lg text-gray-700 mb-6">
          There was an issue with your payment. Please try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-red-700 transition duration-200"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Failure;
