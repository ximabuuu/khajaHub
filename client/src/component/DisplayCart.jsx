import '../App.css'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { X, ShoppingBag, ArrowRight, Truck, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

import { useGlobalContext } from "../global/globalFunc"
import AddToCart from "./AddToCart"
import { DiscountedPrice } from "../utils/DiscountedPrice"

const DisplayCart = ({ close }) => {
  const { originalPriceTotal, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector((state) => state.cartItem.cart)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [isClosing, setIsClosing] = useState(false)

  const redirectToCheckOut = () => {
    if (user?._id) {
      navigate("/checkout")
      if (close) {
        close()
      }
      return
    }
    toast("You are not logged in yet.")
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      close()
    }, 300)
  }

  const getDeliveryCharge = () => {
    const now = new Date()
    const currentHour = now.getHours()
    return currentHour >= 23 ? 120 : 60
  }

  const deliveryCharge = getDeliveryCharge()
  const showLateNightNotice = new Date().getHours() >= 23

  // Calculate savings percentage
  const savingsAmount = originalPriceTotal - totalPrice
  const savingsPercentage = originalPriceTotal > 0 ? Math.round((savingsAmount / originalPriceTotal) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      <div
        className={`bg-white w-full max-w-md h-full shadow-xl transition-transform duration-300 ${isClosing ? "translate-x-full" : "translate-x-0"
          }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-bold text-lg">Your Cart</h2>
            {cartItem.length > 0 && (
              <span className="bg-white text-red-800 text-xs px-2 py-1 rounded-full">{totalQty}</span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100vh-64px)]">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto bg-gray-50">
            {cartItem.length > 0 ? (
              <>
                {/* Savings Banner */}
                {savingsAmount > 0 && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-green-700 font-medium">Your Total Savings</p>
                        <p className="text-sm text-green-600">You saved {savingsPercentage}% on this order</p>
                      </div>
                      <div className="text-green-700 font-bold">Rs. {savingsAmount.toFixed(2)}</div>
                    </div>
                  </div>
                )}

                {/* Cart Items List */}
                <div className="divide-y divide-gray-100">
                  {cartItem.map((item, index) => (
                    <div key={item._id + "cart" + index} className="p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-white">
                          <img
                            src={item?.productId?.image[0] || "https://via.placeholder.com/80"}
                            alt={item?.productId?.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item?.productId?.name}</h3>
                          <p className="text-xs text-gray-500">{item?.restaurant}</p>
                          {item?.productId?.unit && <p className="text-xs text-gray-500">{item?.productId?.unit}</p>}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-1">
                              <span className="font-bold text-red-800">
                                Rs. {DiscountedPrice(item?.productId?.price, item?.productId?.discount)}
                              </span>
                              {item?.productId?.discount > 0 && (
                                <span className="text-xs text-gray-500 line-through">Rs. {item?.productId?.price}</span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <AddToCart
                              productId={item?.productId?._id}
                              selectedRestaurant={{ name: item?.restaurant }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6 max-w-xs">Looks like you haven't added any items to your cart yet.</p>
                <Link
                  to="/"
                  onClick={close}
                  className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-medium hover:from-red-800 hover:to-red-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItem.length > 0 && (
            <div className="border-t border-gray-200">
              {/* Bill Details */}
              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalQty} items)</span>
                    <div className="flex items-center gap-2">
                      {originalPriceTotal !== totalPrice && (
                        <span className="text-gray-500 line-through text-xs">Rs. {originalPriceTotal.toFixed(2)}</span>
                      )}
                      <span>Rs. {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Delivery Fee</span>
                    </div>
                    <span>Rs. {deliveryCharge.toFixed(2)}</span>
                  </div>

                  {showLateNightNotice && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-md mt-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">Late-night delivery charges applied (after 11 PM).</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>Rs. {(totalPrice + deliveryCharge).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="p-4 bg-gray-50">
                <button
                  onClick={redirectToCheckOut}
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:from-red-800 hover:to-red-700 transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DisplayCart
