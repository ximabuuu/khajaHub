import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../global/globalFunc'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi.js'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import LoadingAdd from './LoadingAdd'
import { useSelector } from 'react-redux'
import { FiPlus, FiMinus } from "react-icons/fi";

const AddToCart = ({ productId, selectedRestaurant }) => {
    const [loading, setLoading] = useState(false)
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isThere, setIsThere] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    const handleAdd = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!selectedRestaurant) {
            toast.error("Please select a restaurant")
            return
        }

        setLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.addtocart,
                data: {
                    productId: productId,
                    restaurant: selectedRestaurant?.name
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const checkingItem = cartItem.some(item => item.productId._id === productId)
        setIsThere(checkingItem)

        const cartQty = cartItem.find(item => item.productId._id === productId)
        setQty(cartQty?.quantity)
        setCartItemsDetails(cartQty)
    }, [productId, cartItem])

    const increaseQty = (e) => {
        e.preventDefault()
        e.stopPropagation()
        updateCartItem(cartItemDetails?._id, qty + 1)
    }

    const decreaseQty = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            updateCartItem(cartItemDetails?._id, qty - 1)
        }
    }

    return (
        <div className='w-full max-w-[150px]'>
            {
                isThere ? (
                    <div className='flex'>
                        <button onClick={decreaseQty} className='bg-red-800 hover:bg-red-600 text-white lg:px-1 w-full rounded flex-1 flex items-center justify-center'><FiMinus /></button>
                        <p className='flex-1 w-full font-semibold px-1'>{qty}</p>
                        <button onClick={increaseQty} className='bg-red-800 hover:bg-red-600 text-white lg:px-1 w-full rounded flex-1 flex items-center justify-center'><FiPlus /></button>
                    </div>
                ) : (
                    <button onClick={handleAdd} className='bg-red-800 hover:bg-red-600 text-white lg:px-4 py-1 px-2 rounded'>
                        {loading ? <LoadingAdd /> : "Add"}
                    </button>
                )
            }
        </div>
    )
}

export default AddToCart
