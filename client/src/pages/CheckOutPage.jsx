import '../App.css'
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import {
    MapPin,
    Plus,
    Truck,
    AlertTriangle,
    Tag,
    CheckCircle,
    CreditCard,
    DollarSign,
    ChevronRight,
    Package,
    Check,
    ShoppingBag,
} from "lucide-react"

import { useGlobalContext } from "../global/globalFunc"
import AddAddress from "../component/AddAddress"
import AxiosToastError from "../utils/AxiosToastError"
import SummaryApi from "../config/SummaryApi.js"
import Axios from "../utils/axios"

// Import payment method images
import esewaLogo from "../assets/esewa.png"

const CheckOutPage = () => {
    const { originalPriceTotal, totalPrice, totalQty, fetchCartItem } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector((state) => state.addresses.addressList)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const cartItemsList = useSelector((state) => state.cartItem.cart)
    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)
    const buttonRef = useRef(null)

    const [promoCode, setPromoCode] = useState("")
    const [discount, setDiscount] = useState(0)
    const [promoApplied, setPromoApplied] = useState(false)
    const validPromoCode = "KHAJA10"

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    }

    const paymentMethodVariants = {
        inactive: { scale: 1, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)" },
        active: {
            scale: 1.02,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 300, damping: 20 },
        },
    }

    // Button animation variants
    const buttonVariants = {
        idle: { scale: 1 },
        processing: { scale: 0.98 },
        success: {
            scale: 1,
            backgroundColor: "#22c55e",
            transition: { duration: 0.3 },
        },
    }

    // Success animation variants
    const successIconVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                delay: 0.2,
                duration: 0.5,
            },
        },
    }

    // Confetti animation
    const confettiVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02,
            },
        },
    }

    const confettiItemVariants = {
        hidden: { y: 0, opacity: 0 },
        visible: (i) => ({
            y: [-20, -100 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 360],
            opacity: [0, 1, 0],
            scale: [0, 0.6 + Math.random() * 0.4],
            transition: {
                duration: 1 + Math.random(),
                ease: "easeOut",
            },
        }),
    }

    const applyPromoCode = () => {
        if (promoCode.toUpperCase() === validPromoCode) {
            if (totalPrice >= 500) {
                setDiscount(totalPrice * 0.1)
                setPromoApplied(true)
                toast.success("Promo Code Applied! You got 10% off.")
            } else {
                setDiscount(0)
                setPromoApplied(false)
                toast.error("Promo Code is only applicable for orders Rs. 500 and above.")
            }
        } else {
            setDiscount(0)
            setPromoApplied(false)
            toast.error("Invalid Promo Code.")
        }
    }

    const handlePaymentClick = (e) => {
        if (!addressList[selectedAddress]) {
            e.preventDefault()
            setShowPopup(true)
            return
        }
    }

    const handleCashOnDelivery = async () => {
        if (!addressList[selectedAddress]) {
            setShowPopup(true)
            return
        }

        setIsProcessing(true)

        try {
            const response = await Axios({
                ...SummaryApi.CashOnDelivery,
                data: {
                    list_items: cartItemsList,
                    addressId: addressList[selectedAddress]?._id,
                    totalQty: totalQty,
                    totalAmt: totalPrice - discount + deliveryCharge,
                },
            })

            const { data: responseData } = response
            if (responseData.success) {
                // Show success animation
                setOrderSuccess(true)

                // Fetch updated cart
                if (fetchCartItem) {
                    fetchCartItem()
                }

                // Delay navigation to show the success animation
                setTimeout(() => {
                    navigate("/")
                }, 2000)

                toast.success(responseData.message)
            }
        } catch (error) {
            AxiosToastError(error)
            setIsProcessing(false)
        }
    }

    const handleEsewaPayment = (e) => {
        handlePaymentClick(e)
        if (addressList[selectedAddress]) {
            setSelectedPaymentMethod("esewa")
        }
    }

    const handleCodSelection = (e) => {
        handlePaymentClick(e)
        if (addressList[selectedAddress]) {
            setSelectedPaymentMethod("cod")
        }
    }

    const getDeliveryCharge = () => {
        const now = new Date()
        const currentHour = now.getHours()
        return currentHour >= 23 ? 120 : 60
    }

    const deliveryCharge = getDeliveryCharge()
    const showLateNightNotice = new Date().getHours() >= 23

    // Calculate final amount
    const finalAmount = (totalPrice - discount + deliveryCharge).toFixed(2)

    // Generate confetti pieces
    const confettiColors = ["#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#F44336"]
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    }))

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-500">Complete your order by providing delivery and payment details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Address Selection */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
                        >
                            <div className="border-b border-gray-100 p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-red-800" />
                                        <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                                    </div>
                                    <button
                                        onClick={() => setOpenAddress(true)}
                                        className="text-red-800 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add New
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 md:p-6">
                                {addressList.length > 0 ? (
                                    <div className="grid gap-4">
                                        {addressList.map(
                                            (address, index) =>
                                                address.status && (
                                                    <motion.div key={index} variants={itemVariants}>
                                                        <label
                                                            className={`block cursor-pointer transition-all ${selectedAddress === index ? "ring-2 ring-red-800" : "hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                                                                <input
                                                                    type="radio"
                                                                    name="address"
                                                                    value={index}
                                                                    checked={selectedAddress === index}
                                                                    onChange={() => setSelectedAddress(index)}
                                                                    className="mt-1 text-red-800 focus:ring-red-800"
                                                                />
                                                                <div>
                                                                    <div className="font-medium text-gray-900 mb-1">Delivery Address</div>
                                                                    <div className="text-gray-600 text-sm space-y-1">
                                                                        <p>{address.address_line}</p>
                                                                        <p>
                                                                            {address.city}, {address.Province}
                                                                        </p>
                                                                        <p>
                                                                            {address.country} - {address.pincode}
                                                                        </p>
                                                                        <p className="font-medium text-gray-700">{address.mobile}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </motion.div>
                                                ),
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setOpenAddress(true)}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-red-800 transition-colors"
                                    >
                                        <div className="bg-orange-50 p-3 rounded-full mb-3">
                                            <MapPin className="h-6 w-6 text-red-800" />
                                        </div>
                                        <h3 className="font-medium text-gray-900 mb-1">No addresses found</h3>
                                        <p className="text-gray-500 text-sm mb-3">Add a new address to continue with your order</p>
                                        <button className="text-red-800 font-medium text-sm flex items-center gap-1">
                                            <Plus className="h-4 w-4" />
                                            Add New Address
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Payment Methods */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="border-b border-gray-100 p-4 md:p-6">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-red-800" />
                                    <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                                </div>
                            </div>

                            <div className="p-4 md:p-6">
                                <div className="grid gap-4">
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover="active"
                                        animate={selectedPaymentMethod === "esewa" ? "active" : "inactive"}
                                    >
                                        <div
                                            onClick={handleEsewaPayment}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === "esewa"
                                                    ? "border-red-800 bg-orange-50"
                                                    : "border-gray-200 hover:border-orange-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md p-2 border border-gray-200">
                                                    <img src={esewaLogo || "/placeholder.svg"} alt="eSewa" className="h-full object-contain" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Pay with eSewa</h3>
                                                    <p className="text-sm text-gray-500">Fast and secure payment</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={itemVariants}
                                        whileHover="active"
                                        animate={selectedPaymentMethod === "cod" ? "active" : "inactive"}
                                    >
                                        <div
                                            onClick={handleCodSelection}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === "cod"
                                                    ? "border-red-800 bg-orange-50"
                                                    : "border-gray-200 hover:border-orange-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md p-2 border border-gray-200">
                                                    <DollarSign className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                                                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6"
                        >
                            <div className="border-b border-gray-100 p-4 md:p-6">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-red-800" />
                                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                                </div>
                            </div>

                            <div className="p-4 md:p-6">
                                <div className="space-y-4">
                                    {/* Items Summary */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Items ({totalQty})</span>
                                        <div className="flex items-center gap-2">
                                            {originalPriceTotal !== totalPrice && (
                                                <span className="text-gray-400 line-through text-xs">Rs. {originalPriceTotal.toFixed(2)}</span>
                                            )}
                                            <span className="font-medium">Rs. {totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Delivery Fee */}
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-1">
                                            <Truck className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600">Delivery Fee</span>
                                        </div>
                                        <span className="font-medium">Rs. {deliveryCharge.toFixed(2)}</span>
                                    </div>

                                    {/* Discount */}
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center gap-1">
                                                <Tag className="h-4 w-4 text-green-500" />
                                                <span className="text-gray-600">Discount</span>
                                            </div>
                                            <span className="font-medium text-green-600">-Rs. {discount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {/* Late Night Notice */}
                                    {showLateNightNotice && (
                                        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-md">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-700">Late-night delivery charges applied (after 11 PM).</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Promo Code */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                disabled={promoApplied}
                                            />
                                            <button
                                                onClick={applyPromoCode}
                                                disabled={promoApplied}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium ${promoApplied
                                                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                                                        : "bg-red-800 text-white hover:bg-orange-600"
                                                    }`}
                                            >
                                                {promoApplied ? (
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Applied</span>
                                                    </div>
                                                ) : (
                                                    "Apply"
                                                )}
                                            </button>
                                        </div>
                                        {promoApplied && (
                                            <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Promo code {promoCode.toUpperCase()} applied successfully!
                                            </p>
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex justify-between font-bold text-gray-900">
                                            <span>Total Amount</span>
                                            <span>Rs. {finalAmount}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Including taxes and delivery charges</p>
                                    </div>

                                    {/* Place Order Button */}
                                    <div className="pt-4 relative">
                                        <AnimatePresence>
                                            {selectedPaymentMethod === "cod" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="relative"
                                                >
                                                    <motion.button
                                                        ref={buttonRef}
                                                        onClick={handleCashOnDelivery}
                                                        disabled={isProcessing || orderSuccess}
                                                        variants={buttonVariants}
                                                        initial="idle"
                                                        animate={orderSuccess ? "success" : isProcessing ? "processing" : "idle"}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-700 transition-colors shadow-sm disabled:opacity-70 overflow-hidden"
                                                    >
                                                        {orderSuccess ? (
                                                            <motion.div
                                                                className="flex items-center gap-2"
                                                                initial="hidden"
                                                                animate="visible"
                                                                variants={successIconVariants}
                                                            >
                                                                <Check className="h-5 w-5" />
                                                                <span>Order Placed!</span>
                                                            </motion.div>
                                                        ) : isProcessing ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                                <span>Processing...</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <ShoppingBag className="h-5 w-5" />
                                                                <span>Place Order</span>
                                                            </div>
                                                        )}
                                                    </motion.button>

                                                    {/* Confetti Animation */}
                                                    {orderSuccess && (
                                                        <motion.div
                                                            className="absolute inset-0 pointer-events-none"
                                                            initial="hidden"
                                                            animate="visible"
                                                            variants={confettiVariants}
                                                        >
                                                            {confettiPieces.map((piece) => (
                                                                <motion.div
                                                                    key={piece.id}
                                                                    custom={piece.id}
                                                                    variants={confettiItemVariants}
                                                                    className="absolute left-1/2 top-1/2"
                                                                    style={{
                                                                        width: Math.random() * 8 + 4 + "px",
                                                                        height: Math.random() * 8 + 4 + "px",
                                                                        borderRadius: Math.random() > 0.5 ? "50%" : "0",
                                                                        backgroundColor: piece.color,
                                                                    }}
                                                                />
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )}

                                            {selectedPaymentMethod === "esewa" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            navigate("/payment", {
                                                                state: {
                                                                    selectedAddress: addressList[selectedAddress],
                                                                    discountedPrice: finalAmount,
                                                                },
                                                            })
                                                        }}
                                                        disabled={isProcessing}
                                                        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-600 transition-colors shadow-sm disabled:opacity-70"
                                                    >
                                                        {isProcessing ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                                <span>Redirecting...</span>
                                                            </div>
                                                        ) : (
                                                            <span>Pay with eSewa</span>
                                                        )}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {!selectedPaymentMethod && (
                                            <div className="text-center text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
                                                Please select a payment method to continue
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Address Form Modal */}
            {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

            {/* Address Required Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
                        onClick={() => setShowPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="bg-orange-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-red-800" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Address Required</h3>
                                <p className="text-gray-600 mb-6">Please select a delivery address to continue with your order.</p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => {
                                            setShowPopup(false)
                                            setOpenAddress(true)
                                        }}
                                        className="px-4 py-2 bg-red-800 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                    >
                                        Add Address
                                    </button>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CheckOutPage
