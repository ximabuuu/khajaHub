"use client"

import { useEffect, useState } from "react"
import AxiosToastError from "../utils/AxiosToastError"
import Axios from "../utils/axios"
import SummaryApi from "../config/SummaryApi"
import toast from "react-hot-toast"

const OrdersUser = () => {
  const [data, setData] = useState([])
  const [cash, setCash] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState("all") // 'all', 'esewa', or 'cod'
  const [statusFilter, setStatusFilter] = useState("all") // 'all', 'pending', 'accepted', 'picked', 'delivered'
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.AllEsewa,
      })
      if (response && response.data && response.data.success) {
        setData(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCash = async () => {
    setIsLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.AllCash,
      })
      if (response && response.data && response.data.success) {
        setCash(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus, user) => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords

        const response = await Axios({
          ...SummaryApi.updateOrderStatus(orderId),
          data: {
            orderStatus: newStatus,
            latitude,
            longitude,
            riderId: user?._id
          },
        })

        if (response?.data) {
          setCash((prevOrders) =>
            prevOrders.map((order) => (order._id === orderId ? { ...order, orderStatus: newStatus, riderId: user?._id } : order)),
          )
        }
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const updateEsewaStatus = async (orderId, newStatus, user) => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords

        const response = await Axios({
          ...SummaryApi.updateEsewaStatus(orderId),
          data: {
            orderStatus: newStatus,
            latitude,
            longitude,
            riderId: user?._id
          },
        })

        if (response?.data) {
          setData((prevOrders) =>
            prevOrders.map((order) => (order._id === orderId ? { ...order, orderStatus: newStatus, riderId: user?._id } : order)),
          )
        }
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCash()
  }, [])

  // Get all orders based on active tab and status filter
  const getFilteredOrders = () => {
    let filteredOrders = []

    if (activeTab === "all" || activeTab === "esewa") {
      filteredOrders = [...filteredOrders, ...data]
    }

    if (activeTab === "all" || activeTab === "cod") {
      filteredOrders = [...filteredOrders, ...cash]
    }

    if (statusFilter !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.orderStatus.toLowerCase() === statusFilter)
    }

    return filteredOrders
  }

  // Get counts for each status
  const getStatusCounts = () => {
    const allOrders = [...data, ...cash]
    return {
      all: allOrders.length,
      pending: allOrders.filter((order) => order.orderStatus === "Pending").length,
      accepted: allOrders.filter((order) => order.orderStatus === "Accepted").length,
      picked: allOrders.filter((order) => order.orderStatus === "Picked").length,
      delivered: allOrders.filter((order) => order.orderStatus === "Delivered").length,
    }
  }

  const statusCounts = getStatusCounts()
  const filteredOrders = getFilteredOrders()

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800"
      case "Accepted":
        return "bg-yellow-100 text-yellow-800"
      case "Picked":
        return "bg-purple-100 text-purple-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

const getActionButton = (order, isEsewa, user) => {
  const updateFn = isEsewa ? updateEsewaStatus : updateOrderStatus;

  const isAssignedToMe = order?.riderId === user?._id;

  switch (order.orderStatus) {
    case "Pending":
      return (
        <button
          onClick={() => updateFn(order._id, "Accepted")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          Accept Order
        </button>
      );

    case "Accepted":
      if (!isAssignedToMe) {
        toast(message), {
          icon: '⚠️',
          style: {
            background: '#f44336',
            color: '#fff',
          }
        };
        return (
          <div className="text-center text-red-500 font-semibold">
            Already accepted by {order?.rider?.name || "another rider"}
          </div>
        );
      }
      return (
        <button
          onClick={() => updateFn(order._id, "Picked")}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          Mark as Picked
        </button>
      );

    case "Picked":
      if (!isAssignedToMe) {
        toast(message)
      }
      return (
        <button
          onClick={() => updateFn(order._id, "Delivered")}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          Complete Delivery
        </button>
      );

    default:
      return null;
  }
}


  return (
    <div className=" max-h-[60vh] bg-gray-50">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rider Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your delivery orders</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => {
                fetchData()
                fetchCash()
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh Orders
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div
            className={`bg-white rounded-lg shadow-sm p-3 border-l-4 cursor-pointer ${statusFilter === "all" ? "border-blue-500" : "border-gray-200"
              }`}
            onClick={() => setStatusFilter("all")}
          >
            <p className="text-xs text-gray-500">All Orders</p>
            <p className="text-xl font-bold">{statusCounts.all}</p>
          </div>
          <div
            className={`bg-white rounded-lg shadow-sm p-3 border-l-4 cursor-pointer ${statusFilter === "pending" ? "border-blue-500" : "border-gray-200"
              }`}
            onClick={() => setStatusFilter("pending")}
          >
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-bold">{statusCounts.pending}</p>
          </div>
          <div
            className={`bg-white rounded-lg shadow-sm p-3 border-l-4 cursor-pointer ${statusFilter === "accepted" ? "border-blue-500" : "border-gray-200"
              }`}
            onClick={() => setStatusFilter("accepted")}
          >
            <p className="text-xs text-gray-500">Accepted</p>
            <p className="text-xl font-bold">{statusCounts.accepted}</p>
          </div>
          <div
            className={`bg-white rounded-lg shadow-sm p-3 border-l-4 cursor-pointer ${statusFilter === "picked" ? "border-blue-500" : "border-gray-200"
              }`}
            onClick={() => setStatusFilter("picked")}
          >
            <p className="text-xs text-gray-500">Picked</p>
            <p className="text-xl font-bold">{statusCounts.picked}</p>
          </div>
          <div
            className={`bg-white rounded-lg shadow-sm p-3 border-l-4 cursor-pointer ${statusFilter === "delivered" ? "border-blue-500" : "border-gray-200"
              }`}
            onClick={() => setStatusFilter("delivered")}
          >
            <p className="text-xs text-gray-500">Delivered</p>
            <p className="text-xl font-bold">{statusCounts.delivered}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("all")}
            >
              All Orders
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "esewa" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("esewa")}
            >
              Esewa Payments
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "cod" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("cod")}
            >
              COD Payments
            </button>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {statusFilter !== "all"
                ? `No ${statusFilter} orders available at the moment.`
                : "There are no orders available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const isEsewa = "product_id" in order
              const orderId = isEsewa ? order.product_id : order.orderId
              const amount = isEsewa ? order.amount : order.totalAmt
              const paymentStatus = isEsewa ? order.status : order.payment_status

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {isEsewa ? "Esewa" : "COD"}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-800">{orderId}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Ordered on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Order Content */}
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.userId.name}</p>
                        <p className="text-xs text-gray-500">{order.delivery_address.mobile}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-xs text-gray-600">
                          {order.delivery_address.city}, {order.delivery_address.address_line}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-xs text-gray-600">
                          {order.totalQty} items · Rs. {amount} · {paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="bg-gray-50 rounded-md p-2 mb-4 max-h-[120px] overflow-y-auto">
                      {order.product_details.map((prod, index) => (
                        <div
                          key={`${prod.name}-${index}`}
                          className="flex justify-between py-1 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-xs truncate max-w-[70%]">{prod.name}</span>
                          <div className="flex gap-2">
                            <span className="text-xs text-gray-500">{prod.restaurant}</span>
                            <span className="text-xs font-medium">x{prod.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    {getActionButton(order, isEsewa)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersUser
