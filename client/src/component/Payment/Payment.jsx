import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Axios from "../../utils/axios";
import SummaryApi from "../../config/SummaryApi.js";
import toast from "react-hot-toast";
import { useGlobalContext } from "../../global/globalFunc";
import esewa from '../../assets/esewa.png'
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Payment = () => {
    const { totalQty } = useGlobalContext();
    const cartItemsList = useSelector(state => state.cartItem.cart);
    const location = useLocation();
    const selectedAddress = location.state?.selectedAddress;

    const [amount, setAmount] = useState(location.state?.discountedPrice || 0);

    useEffect(() => {
        if (!amount) {
            setAmount(location.state?.discountedPrice || 0);
        }
    }, [location.state?.discountedPrice]);

    const handlePayment = async (e) => {
        e.preventDefault();

        const uniqueProductId = uuidv4();

        const requestData = {
            amount: amount,
            productId: uniqueProductId,
            list_items: cartItemsList,
            addressId: selectedAddress,
            totalQty: totalQty
        };

        console.log("Sending Payment Request:", requestData);

        try {
            const response = await Axios.post(SummaryApi.esewaPay.url, requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Esewa Response:", response.data);
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error initiating payment:", error);
            if (error.response) {
                toast.error(error.response.data.message || "Payment failed.");
            } else {
                toast.error("Network error, please try again.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <div className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-8 w-full max-w-md border border-gray-100">
                <div className="relative mb-8">
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg">
                        <img src={esewa || "/placeholder.svg"} alt="esewa" width={50} height={50} className="object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800 mt-8 pt-2">
                        Pay With <span className="text-green-500">eSewa</span>
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-3 rounded-full"></div>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-2 text-sm uppercase tracking-wide">Amount (NPR)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-medium">Rs.</span>
                            </div>
                            <input
                                type="number"
                                value={amount}
                                readOnly
                                className="w-full pl-12 pr-4 py-3.5 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Pay Now
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">Secure payment processed by eSewa. Your information is protected.</p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
