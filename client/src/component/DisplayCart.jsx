import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../global/globalFunc';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useSelector } from 'react-redux';
import AddToCart from './AddToCart';
import { DiscountedPrice } from '../utils/DiscountedPrice';
import emptyCart from '../assets/emptyCart.png'
import toast from 'react-hot-toast';

const DisplayCart = ({ close }) => {

  const { originalPriceTotal, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const redirectToCheckOut = () => {
    if (user?._id) {
      navigate("/checkout")
      if (close) {
        close()
      }
      return
    }
    toast("You are not Logged in yet.")
  }


  const getDeliveryCharge = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 23 ? 120 : 60;
  };

  const deliveryCharge = getDeliveryCharge()

  const showLateNightNotice = new Date().getHours() >= 23;

  return (
    <section className='bg-neutral-900/50 fixed top-0 right-0 left-0 bottom-0 z-50'>
      <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
        <div className='bg-white flex justify-between items-center p-4 shadow-md '>
          <h2 className='font-semibold text-lg '>Cart</h2>
          <Link to={"/"} className='ml-auto  lg:hidden  '><IoMdCloseCircle size={25} /></Link>
          <button className='ml-auto  hidden lg:block' onClick={close}><IoMdCloseCircle size={25} /></button>
        </div>
        <div className='max-h-[calc(100vh-135px)] h-full lg:min-h-[80vh] min-h-[77vh] bg-blue-50 p-2 flex flex-col gap-4'>
          {
            cartItem[0] ? (
              <>
                <div className='flex items-center px-4 py-2 bg-blue-100 text-blue-500 rounded justify-between'>
                  <p>Your Total Savings </p>
                  <p>Rs. {originalPriceTotal - totalPrice}</p>
                </div>
                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                  {
                    cartItem[0] && (
                      cartItem.map((i, index) => {
                        return (
                          <div key={i._id + "cart" + index} className='flex w-full gap-4 items-center '>
                            <div className='w-15 h-15 min-w-16 min-h-16 border rounded'>
                              <img src={i?.productId?.image[0]} alt="" className='object-scale-down' />
                            </div>
                            <div className='w-full max-w-sm'>
                              <p className='text-ellipsis line-clamp-1'>{i?.productId?.name}</p>
                              <p className='text-xs text-slate-700'>{i?.productId?.unit}</p>
                              <p className='text-sm font-semibold'>Rs. {DiscountedPrice(i?.productId?.price, i?.productId?.discount)}</p>
                            </div>
                            <div>
                              <AddToCart data={i?.productId} />
                            </div>
                          </div>
                        )
                      })
                    )
                  }
                </div>
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
                    <p className='font-medium flex items-center gap-2'><span>Rs. {deliveryCharge}</span></p>
                  </div>
                  {showLateNightNotice && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 rounded">
                      <p className="text-sm font-medium">
                        Late-night delivery charges applied. (After 11 PM)
                      </p>
                    </div>
                  )}
                  <div className='font-semibold flex items-center justify-between gap-4'>
                    <p>Grand Totals</p>
                    <p>Rs. {totalPrice + deliveryCharge}</p>
                  </div>
                </div>

              </>
            ) : (
              <div className='bg-white flex flex-col items-center justify-center'>
                <img src={emptyCart} alt="empty cart" className='w-full h-full object-scale-down' />
                <Link onClick={close} to={"/"} className='bg-red-800 text-white px-2 py-1 rounded m-2 hover:bg-red-600 font-semibold'>Shop Now</Link>
              </div>
            )
          }
        </div>
        {
          cartItem[0] && (
            <div className='p-2'>
              <div className='bg-red-800 text-white p-2 py-4 sticky bottom-3 font-bold lg:text-lg text-base rounded flex gap-4 items-center justify-between'>
                <div>
                  Rs. {totalPrice + deliveryCharge}
                </div>
                <div>

                </div>
                <div>
                  <button onClick={redirectToCheckOut} className='flex items-center gap-1 cursor-pointer'>
                    Proceed
                    <span><FaArrowAltCircleRight size={15} /></span>
                  </button>
                </div>
              </div>
            </div>

          )
        }
      </div>
    </section>
  )
}

export default DisplayCart
