"use client"

import { useEffect, useState } from "react"
import AxiosToastError from "../utils/AxiosToastError"
import Axios from "../utils/axios"
import SummaryApi from "../config/SummaryApi"

const OrdersAdmin = () => {
  const [data, setData] = useState([])
  const [cash, setCash] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState("esewa") // 'esewa' or 'cod'
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
  }, [])

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        url: `/api/orders/${orderId}/orderStatus`,
        method: "PUT",
        data: { orderStatus: newStatus },
      })

      const updatedOrder = response.data

      setOrders((prevOrders) => prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)))
    } catch (error) {
      console.error("Error updating order status", error)
    }
  }

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

  useEffect(() => {
    fetchData()
    fetchCash()
  }, [])

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Accepted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "On the way":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Render order card
  const renderOrderCard = (order, type) => {
    const isEsewa = type === "esewa"
    const orderId = isEsewa ? order.product_id : order.orderId
    const amount = isEsewa ? order.amount : order.totalAmt
    const status = isEsewa ? order.status : order.payment_status

    return (
      <div
        key={order._id}
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      >
        {/* Order Header */}
        <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${order.orderStatus === "Delivered" ? "bg-green-500" : order.orderStatus === "Cancelled" ? "bg-red-500" : "bg-blue-500"}`}
            ></div>
            <h3 className="font-medium text-gray-800 truncate">{orderId.slice(0,15)}</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>

        {/* Order Content */}
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex-1 min-w-[180px]">
              <p className="text-xs text-gray-500">Customer</p>
              <p className="text-sm font-medium">{order.userId.name}</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-sm font-medium">Rs. {amount}</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs text-gray-500">Payment</p>
              <p className="text-sm font-medium">{status}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex-1 min-w-[180px]">
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm">
                {order.delivery_address.city}, {order.delivery_address.address_line}
              </p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs text-gray-500">Mobile</p>
              <p className="text-sm">{order.delivery_address.mobile}</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Products */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Products</p>
            <div className="bg-gray-50 rounded-md p-2 max-h-[150px] overflow-y-auto">
              {order.product_details.map((prod, index) => (
                <div
                  key={`${prod.name}-${index}`}
                  className="flex justify-between py-1 border-b border-gray-100 last:border-0"
                >
                  <span className="text-xs">
                    {prod.name} ({prod.unit})
                  </span>
                  <div className="flex gap-2">
                    <span className="text-xs text-gray-500">{prod.restaurant}</span>
                    <span className="text-xs font-medium">x{prod.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rider Information */}
          {order.orderStatus !== "Pending" && order.rider && (
            <div className="mt-3 bg-blue-50 rounded-md p-3 border border-blue-100">
              <p className="text-xs text-blue-700 font-medium mb-1">Rider Information</p>
              <div className="flex justify-between">
                <span className="text-xs">{order.rider.name}</span>
                <span className="text-xs">{order.rider.mobile}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-sm text-gray-500">View and manage all customer orders</p>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{data.length + cash.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Esewa Payments</p>
            <p className="text-2xl font-bold">{data.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">COD Payments</p>
            <p className="text-2xl font-bold">{cash.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold">
              {data.filter((order) => order.orderStatus === "Pending").length +
                cash.filter((order) => order.orderStatus === "Pending").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "esewa" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("esewa")}
            >
              Esewa Orders
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === "cod" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("cod")}
            >
              COD Orders
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeTab === "esewa" ? (
              data.length > 0 ? (
                data.map((order) => renderOrderCard(order, "esewa"))
              ) : (
                <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500">No Esewa orders found</p>
                </div>
              )
            ) : cash.length > 0 ? (
              cash.map((order) => renderOrderCard(order, "cod"))
            ) : (
              <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No COD orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default OrdersAdmin
