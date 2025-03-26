import React from 'react'
import { BsCart4 } from "react-icons/bs";
import { useGlobalContext } from '../global/globalFunc';
import { Link } from 'react-router-dom';
import { IoMdArrowDropright } from "react-icons/io";
import { useSelector } from 'react-redux';

const CartMobile = () => {

    const { totalQty, totalPrice } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)

    return (
        <>
            {
                cartItem[0] && (
                    <div className=' sticky bottom-4 px-2'>
                        <div className='bg-red-800 px-2 py-1 rounded text-white text-sm flex items-center lg:hidden justify-between gap-3'>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 bg-red-700 rounded w-fit '>
                                    <BsCart4 size={20} />
                                </div>
                                <div className=''>
                                    <p>{totalQty} Items</p>
                                    <p className='font-semibold'>Rs. {totalPrice}</p>
                                </div>
                            </div>
                            <div>
                                <Link to={"/cart"} className='flex items-center gap-1 '><span>View Cart</span><IoMdArrowDropright size={25} /></Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </>

    )
}

export default CartMobile
