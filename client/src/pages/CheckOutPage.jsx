import React, { useState } from 'react'
import { useGlobalContext } from '../global/globalFunc'
import esewa from '../assets/esewa.png'
import { Link, useNavigate } from 'react-router-dom'
import AddAddress from '../component/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../config/summaryApi'
import toast from 'react-hot-toast'
import Axios from '../utils/axios'

const CheckOutPage = () => {

    const { originalPriceTotal, totalPrice, totalQty,fetchCartItem } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.addresses.addressList)
    const [selectedAddress, setSelectedAddress] = useState(0)
    const cartItemsList = useSelector(state => state.cartItem.cart)
    const navigate = useNavigate()

    const handleCashOnDelivery = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.CashOnDelivery,
                data: {
                    list_items: cartItemsList,
                    addressId: addressList[selectedAddress]?._id,
                    totalQty: totalQty,
                    totalAmt: totalPrice + 60,
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
                navigate('/')
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='bg-blue-50 p-4'>
            <div className='container mx-auto p-4 flex w-full gap-5 justify-between flex-col lg:flex-row'>
                <div className='text-lg font-semibold  w-full'>
                    {/* address */}
                    <h2>Choose Your Address</h2>

                    <div className='bg-white p-1 grid gap-4'>
                        {
                            addressList.map((a, index) => {
                                return (
                                    <label htmlFor={"address" + index} className={!a.status && "hidden"}>
                                        <div className='text-base font-normal border rounded p-3 text-neutral-700 flex gap-2 hover:bg-blue-50'>
                                            <div>
                                                <input id={"address" + index} type="radio" value={index} onChange={() => setSelectedAddress(a.target.value)} name="address" />
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
                                )
                            })
                        }
                        <div onClick={() => setOpenAddress(true)} className='h-24 bg-blue-50 border border-blue-200 border-dashed flex justify-center items-center cursor-pointer'>
                            Add Address
                        </div>
                    </div>

                </div>

                <div className='w-full max-w-md bg-white py-4 px-2 rounded'>
                    {/* all details */}
                    <h3 className='text-lg font-semibold'>Product Details</h3>
                    <div className='bg-white p-4'>
                        <h3 className='font-semibold'>Bill Details</h3>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Total Items</p>
                            <p className='font-medium flex items-center gap-2'><span className='line-through text-neutral-700'>Rs. {originalPriceTotal}</span><span>Rs. {totalPrice}</span></p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Total Quantity</p>
                            <p className='font-medium flex items-center gap-2'><span>{totalQty} Items</span></p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Delivery Charge</p>
                            <p className='font-medium flex items-center gap-2'><span>Rs. 60</span></p>
                        </div>
                        <div className='font-semibold flex items-center justify-between gap-4'>
                            <p>Grand Totals</p>
                            <p>Rs. {totalPrice + 60}</p>
                        </div>
                    </div>
                    <div className='w-full max-w-md flex flex-col gap-4 font-semibold'>
                        <Link to={"/payment"} className='py-2 px-4 bg-red-800 text-white hover:bg-red-700 rounded flex items-center justify-center '><img src={esewa} alt="esewa" className='w-6' />Pay with Esewa</Link>
                        <button onClick={handleCashOnDelivery} className='py-2 px-4 border border-red-800 hover:text-white text-red-800 hover:bg-red-800 rounded '>Cash on Delivery</button>
                    </div>
                </div>
            </div>

            {
                openAddress && (
                    <AddAddress close={() => setOpenAddress(false)} />
                )
            }
        </section>
    )
}

export default CheckOutPage
