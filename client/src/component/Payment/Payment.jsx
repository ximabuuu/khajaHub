import React, { useState, useEffect } from "react";
import axios from "axios";
import { generateUniqueId } from "esewajs";
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

    // Get the discounted price from CheckoutPage
    const [amount, setAmount] = useState(location.state?.discountedPrice || 0);

    useEffect(() => {
        if (!amount) {
            setAmount(location.state?.discountedPrice || 0);
        }
    }, [location.state?.discountedPrice]);

    const handlePayment = async (e) => {
        e.preventDefault();

        const requestData = {
            amount: amount,
            productId: generateUniqueId(),
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <img src={esewa} alt="esewa" width={50} className="object-contain" />
                    <h1 className="text-2xl font-semibold text-center text-black">
                        Pay With Esewa
                    </h1>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            readOnly
                            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Pay
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
