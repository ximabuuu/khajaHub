import React, { useState } from 'react';
import { useGlobalContext } from '../global/globalFunc';
import esewa from '../assets/esewa.png';
import { Link, useNavigate } from 'react-router-dom';
import AddAddress from '../component/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../config/SummaryApi.js';
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import BikeDeliveryAnimation from '../component/BikeDeliveryAnimation.jsx';

const CheckOutPage = () => {
    const { originalPriceTotal, totalPrice, totalQty, fetchCartItem } = useGlobalContext();
    const [openAddress, setOpenAddress] = useState(false);
    const addressList = useSelector(state => state.addresses.addressList);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const cartItemsList = useSelector(state => state.cartItem.cart);
    const [isDelivering, setIsDelivering] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const validPromoCode = "KHAJA10";

    const applyPromoCode = () => {
        if (promoCode.toUpperCase() === validPromoCode) {
            if (totalPrice >= 500) {
                setDiscount(totalPrice * 0.1);
                toast.success("Promo Code Applied! You got 10% off.");
            } else {
                setDiscount(0);
                toast.error("Promo Code is only applicable for orders Rs. 500 and above.");
            }
        } else {
            setDiscount(0);
            toast.error("Invalid Promo Code.");
        }
    };


    const handlePaymentClick = (e) => {
        if (!addressList[selectedAddress]) {
            e.preventDefault()
            setShowPopup(true)
        }
    };

    const handleCashOnDelivery = async () => {
        if (!addressList[selectedAddress]) {
            setShowPopup(true)
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.CashOnDelivery,
                data: {
                    list_items: cartItemsList,
                    addressId: addressList[selectedAddress]?._id,
                    totalQty: totalQty,
                    totalAmt: totalPrice - discount + 60,
                },
            });

            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                if (fetchCartItem) {
                    fetchCartItem();
                }

                setIsDelivering(true);

                setTimeout(() => {
                    setIsDelivering(false);
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="bg-blue-50 p-4">
            <div className="container mx-auto p-4 flex w-full gap-5 justify-between flex-col lg:flex-row">
                <div className="text-lg font-semibold w-full">
                    <h2>Choose Your Address</h2>
                    <div className="bg-white p-1 grid gap-4">
                        {addressList.map((a, index) => (
                            <label key={index} htmlFor={"address" + index} className={!a.status && 'hidden'}>
                                <div className="text-base font-normal border rounded p-3 text-neutral-700 flex gap-2 hover:bg-blue-50">
                                    <div>
                                        <input
                                            id={"address" + index}
                                            type="radio"
                                            value={index}
                                            checked={selectedAddress === index}
                                            onChange={() => setSelectedAddress(index)}
                                            name="address"
                                        />
                                    </div>
                                    <div>
                                        <p>{a.address_line}</p>
                                        <p>{a.city}</p>
                                        <p>{a.Province}</p>
                                        <p>{a.country} - {a.pincode}</p>
                                        <p>{a.mobile}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                        <div
                            onClick={() => setOpenAddress(true)}
                            className="h-24 bg-blue-50 border border-blue-200 border-dashed flex justify-center items-center cursor-pointer"
                        >
                            Add Address
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md bg-white py-4 px-2 rounded">
                    <h3 className="text-lg font-semibold">Product Details</h3>
                    <div className="bg-white p-4">
                        <h3 className="font-semibold">Bill Details</h3>
                        <div className="flex gap-4 justify-between ml-1">
                            <p>Total Items</p>
                            <p className="font-medium flex items-center gap-2">
                                <span className="line-through text-neutral-700">Rs. {originalPriceTotal}</span>
                                <span>Rs. {totalPrice}</span>
                            </p>
                        </div>
                        <div className="flex gap-4 justify-between ml-1">
                            <p>Delivery Charge</p>
                            <p className="font-medium">Rs. 60</p>
                        </div>

                        <div className="mt-3">
                            <label className="block font-semibold">Apply Promo Code:</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Promo Code"
                                    className="p-2 border w-full rounded"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button
                                    onClick={applyPromoCode}
                                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Apply
                                </button>
                            </div>
                            {discount > 0 && (
                                <p className="text-green-600 text-sm mt-1">Discount Applied: Rs. {discount.toFixed(2)}</p>
                            )}
                        </div>

                        <div className="font-semibold flex items-center justify-between gap-4 mt-3">
                            <p>Grand Total</p>
                            <p>Rs. {(totalPrice - discount + 60).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="w-full max-w-md flex flex-col gap-4 font-semibold">
                        <Link
                            to={"/payment"}
                            state={{
                                selectedAddress: addressList[selectedAddress],
                                discountedPrice: (totalPrice - discount + 60).toFixed(2),
                            }}
                            onClick={handlePaymentClick}
                            className="py-2 px-4 bg-red-800 text-white hover:bg-red-700 rounded flex items-center justify-center"
                        >
                            <img src={esewa} alt="esewa" className="w-6" />
                            Pay with Esewa
                        </Link>

                        <button
                            onClick={handleCashOnDelivery}
                            className="py-2 px-4 border border-red-800 hover:text-white text-red-800 hover:bg-red-800 rounded"
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>
            </div>

            {isDelivering && <BikeDeliveryAnimation isDelivering={isDelivering} />}

            {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

            {showPopup && (
                <div className="fixed inset-0 bg-black/20 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p className="text-lg font-semibold">Please provide a delivery address.</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CheckOutPage;
