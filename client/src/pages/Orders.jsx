import "../App.css"
import { useEffect, useRef, useState } from "react"
import {Link} from 'react-router-dom'
import axios from "../utils/axios"
import SummaryApi from "../config/SummaryApi"
import { toast } from "react-hot-toast"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [transactions, setTransactions] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})
  const [expandedMaps, setExpandedMaps] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("current") // 'current' or 'past'
  const [isRefreshing, setIsRefreshing] = useState(false)
  // Create a ref object for each order
  const receiptRefs = useRef({})

  const handleUserOrder = async () => {
    try {
      setLoading(true)
      const response = await axios(SummaryApi.UserOrder)
      setOrders(response.data.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleUserTransaction = async () => {
    try {
      const response = await axios(SummaryApi.getUserTransaction)
      setTransactions(response.data.data)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch transactions")
    } finally {
      setIsRefreshing(false)
    }
  }

  const refreshOrders = () => {
    setIsRefreshing(true)
    handleUserOrder()
    handleUserTransaction()
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const toggleMap = (orderId) => {
    setExpandedMaps((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  // const handleDownloadPDF = async (orderData) => {
  //   try {
  //     // Get the specific order's ref
  //     const element = receiptRefs.current[orderData._id]

  //     if (!element) {
  //       toast.error("Unable to generate receipt. Please try again.")
  //       return
  //     }

  //     toast.loading("Generating receipt...")

  //     const canvas = await html2canvas(element, {
  //       scale: 2,
  //       // Ensure we capture background colors
  //       backgroundColor: "#ffffff",
  //       // This ensures we capture the full height
  //       height: element.scrollHeight,
  //     })

  //     const imgData = canvas.toDataURL("image/png")

  //     const pdf = new jsPDF("p", "mm", "a4")
  //     const imgProps = pdf.getImageProperties(imgData)
  //     const pdfWidth = pdf.internal.pageSize.getWidth()
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
  //     pdf.save(`Receipt_${orderData._id}.pdf`)

  //     toast.dismiss()
  //     toast.success("Receipt downloaded successfully!")
  //   } catch (error) {
  //     toast.dismiss()
  //     toast.error("Failed to generate receipt: " + error.message)
  //     console.error("PDF generation error:", error)
  //   }
  // }

  const Print = ()=>{
    window.print()
  }

  useEffect(() => {
    handleUserOrder()
    handleUserTransaction()
  }, [])

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusColors = {
      Pending: "bg-yellow-500",
      Accepted: "bg-blue-500",
      "On the way": "bg-purple-500",
      Delivered: "bg-green-500",
      Cancelled: "bg-red-500",
    }
    return statusColors[status] || "bg-gray-500"
  }

  // Combine orders and transactions
  const allOrders = [...orders, ...transactions]

  // Filter orders based on active tab
  const filteredOrders = allOrders.filter((order) => {
    if (activeTab === "current") {
      return order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
    } else {
      return order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
    }
  })

  return (
    <div className="px-2 py-4 sm:px-4 md:p-6 max-w-[50vh] md:max-w-screen overflow-hidden">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Your Orders</h2>
        <button
          onClick={refreshOrders}
          className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Refresh orders"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Tab Navigation - Sticky on mobile */}
      <div className="sticky top-0 z-10 bg-white border-b mb-4 -mx-2 px-2 sm:mx-0 sm:px-0 sm:static sm:bg-transparent">
        <div className="flex w-full">
          <button
            className={`py-3 flex-1 font-medium text-sm sm:text-base ${activeTab === "current"
              ? "text-[#783232] border-b-2 border-[#783232]"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("current")}
          >
            Current Orders
          </button>
          <button
            className={`py-3 flex-1 font-medium text-sm sm:text-base ${activeTab === "past" ? "text-[#783232] border-b-2 border-[#783232]" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("past")}
          >
            Past Orders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#783232] mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No Orders Found</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            {activeTab === "current"
              ? "You don't have any active orders at the moment."
              : "You haven't completed any orders yet."}
          </p>
          <button className="mt-4 bg-[#783232] text-white py-2 px-4 rounded-lg text-sm sm:text-base hover:bg-red-800 transition-colors">
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Order Header - Always visible */}
              <div
                className="p-2 sm:p-4 border-b cursor-pointer flex justify-between items-center"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <div className="flex items-center min-w-0 flex-1 overflow-hidden">
                  <div className="bg-[#783232] bg-opacity-10 p-1.5 sm:p-3 rounded-full mr-2 sm:mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 text-[#783232]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 ">
                      {order.orderId.slice(0, 15) || order.product_id}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0 ml-2">
                  <span
                    className={`${getStatusColor(
                      order.orderStatus,
                    )} text-white text-xs py-1 px-1.5 sm:px-3 rounded-full mr-1 sm:mr-2 whitespace-nowrap`}
                  >
                    {order.orderStatus}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-500 transition-transform duration-300 ${expandedOrders[order._id] ? "rotate-180" : ""
                      }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Order Details - Expandable */}
              {expandedOrders[order._id] && (
                <div
                  className="p-2 sm:p-4 bg-gray-50 animate-fadeIn overflow-hidden"
                  ref={(el) => (receiptRefs.current[order._id] = el)}
                >
                  {/* Order Summary & Progress - Stack on mobile, grid on larger screens */}
                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Order Summary</h4>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">Rs. {order.totalAmt || order.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">{order.payment_status || "Esewa"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Address:</span>
                          <span className="font-medium text-right max-w-[120px] sm:max-w-[60%] truncate">
                            {order.delivery_address?.address_line ? ` ${order.delivery_address.address_line}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Progress Tracker */}
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Order Progress</h4>
                      <div className="relative">
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                        <div className="space-y-3 relative">
                          <div className="flex items-center">
                            <div
                              className={`z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${order.orderStatus === "Pending" ? "bg-yellow-500" : "bg-green-500"
                                } text-white`}
                            >
                              {order.orderStatus === "Pending" ? "1" : "✓"}
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-xs sm:text-sm">Order Placed</p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div
                              className={`z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${order.orderStatus === "Accepted"
                                ? "bg-blue-500"
                                : order.orderStatus === "Pending"
                                  ? "bg-gray-300"
                                  : "bg-green-500"
                                } text-white`}
                            >
                              {order.orderStatus === "Accepted" ? "2" : order.orderStatus === "Pending" ? "2" : "✓"}
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-xs sm:text-sm">Order Accepted</p>
                              <p className="text-xs text-gray-500">
                                {order.orderStatus === "Pending" ? "Waiting" : "Confirmed"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div
                              className={`z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${order.orderStatus === "On the way"
                                ? "bg-purple-500"
                                : ["Pending", "Accepted"].includes(order.orderStatus)
                                  ? "bg-gray-300"
                                  : "bg-green-500"
                                } text-white`}
                            >
                              {order.orderStatus === "On the way"
                                ? "3"
                                : ["Pending", "Accepted"].includes(order.orderStatus)
                                  ? "3"
                                  : "✓"}
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-xs sm:text-sm">On the way</p>
                              <p className="text-xs text-gray-500">
                                {["Pending", "Accepted"].includes(order.orderStatus)
                                  ? "Waiting"
                                  : order.orderStatus === "On the way"
                                    ? "In progress"
                                    : "Completed"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div
                              className={`z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${order.orderStatus === "Delivered" ? "bg-green-500" : "bg-gray-300"
                                } text-white`}
                            >
                              {order.orderStatus === "Delivered" ? "✓" : "4"}
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <p className="font-medium text-xs sm:text-sm">Delivered</p>
                              <p className="text-xs text-gray-500">
                                {order.orderStatus === "Delivered" ? "Completed" : "Waiting"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products List */}
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-3 sm:mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Products</h4>
                    <div className="space-y-2 sm:space-y-3 max-h-[200px] overflow-y-auto">
                      {order.product_details &&
                        order.product_details.map((product, index) => (
                          <div
                            key={`${product.productId || product.name}-${index}`}
                            className="flex items-center p-2 border rounded-lg hover:bg-gray-50"
                          >
                            {product.image && product.image[0] ? (
                              <img
                                src={product.image[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <span className="text-gray-500 font-medium">{product.name.charAt(0)}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm truncate">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate">
                                Qty: {product.quantity} • {product.restaurant || "Restaurant"}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Rider Information */}
                  {order.orderStatus !== "Pending" && order.orderStatus !== "Delivered" && order.rider && (
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-3 sm:mb-4 border-l-4 border-[#783232]">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="bg-[#783232] bg-opacity-10 p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-[#783232]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Delivery Rider</h4>
                      </div>

                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#783232] flex items-center justify-center text-white font-bold mr-3 sm:mr-4 flex-shrink-0">
                          <img src={order.rider.avatar} alt="rider" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{order.rider.name}</p>
                          <p className="text-xs text-gray-500 truncate">{order.rider.mobile}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleMap(order._id)}
                        className="w-full py-2 px-4 bg-[#783232] text-white rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center text-xs sm:text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {expandedMaps[order._id] ? "Hide Map" : "Track Order"}
                      </button>

                      {/* Map */}
                      {expandedMaps[order._id] && order.rider.location && (
                        <div className="mt-3 sm:mt-4 rounded-lg overflow-hidden border border-gray-200 h-48 sm:h-64 animate-fadeIn">
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://maps.google.com/maps?q=${order.rider.location.latitude},${order.rider.location.longitude}&z=15&output=embed`}
                            allowFullScreen
                            title="Rider Location"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons - Stack on small mobile, flex on larger screens */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-3 mt-3 sm:mt-4">
                    {order.orderStatus === "Pending" && (
                      <button className="col-span-1 xs:col-span-2 sm:flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-xs sm:text-sm hover:bg-red-600 transition-colors flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                      </button>
                    )}
                    <button
                      onClick={Print}
                      className="col-span-1 sm:flex-1 py-2 px-3 bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      <span className="hidden xs:inline">Print Receipt</span>
                      <span className="inline xs:hidden">Receipt</span>
                    </button>
                    <Link to={'/contact'} className="col-span-1 sm:flex-1 py-2 px-3 bg-[#783232] text-white rounded-lg text-xs sm:text-sm hover:bg-red-800 transition-colors flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="hidden xs:inline">Get Help</span>
                      <span className="inline xs:hidden">Help</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pull to refresh indicator for mobile */}
      <div className="text-center text-xs text-gray-500 mt-4 sm:hidden">
        {isRefreshing ? "Refreshing..." : "Pull down to refresh"}
      </div>
    </div>
  )
}

export default Orders
