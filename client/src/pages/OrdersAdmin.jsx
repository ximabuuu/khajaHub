import React, { useEffect, useState } from 'react'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/axios'
import SummaryApi from '../config/SummaryApi'

const OrdersAdmin = () => {

  const [data, setData] = useState([])
  const [cash, setCash] = useState([])
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        url: `/api/orders/${orderId}/orderStatus`,
        method: "PUT",
        data: { orderStatus: newStatus },
      });

      const updatedOrder = response.data;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };


  const fetchData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.AllEsewa
      })
      if (response && response.data && response.data.success) {
        setData(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const fetchCash = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.AllCash
      })
      if (response && response.data && response.data.success) {
        setCash(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchData()
    fetchCash()
  }, [])

  return (
    <section className="flex flex-col gap-8 p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-300 text-white px-4 py-2 rounded-lg shadow-lg">
        <h1 className="font-semibold text-2xl">All Orders</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h1 className="font-semibold text-xl text-gray-800 mb-4">Esewa Orders</h1>
          <ul className="space-y-6 overflow-y-auto max-h-[70vh]">
            {
              data.map((item) => (
                <div key={item._id} className="bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200">
                  <li className="text-sm text-gray-600"><span className="font-semibold">Order ID:</span> {item.product_id}</li>
                  <li className="text-sm text-gray-600"><span className="font-semibold">Customer Name:</span> {item.userId.name}</li>
                  <p className="text-sm font-semibold text-gray-700 mt-2">Products:</p>
                  <ul className="list-disc pl-6">
                    {
                      item.product_details.map((prod) => (
                        <li key={prod.name} className="text-sm text-gray-600">{prod.name} - Qty {prod.quantity} - {prod.unit}</li>
                      ))
                    }
                  </ul>
                  <div className="flex justify-between text-sm text-gray-600 mt-4">
                    <div><span className="font-semibold">Total Qty:</span> {item.totalQty}</div>
                    <div><span className="font-semibold">Amount:</span> Rs. {item.amount}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Address:</span> {item.delivery_address.city} - {item.delivery_address.address_line}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Mobile:</span> {item.delivery_address.mobile}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Status:</span> {item.status}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className='font-semibold'>Ordered On: </span> {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            }
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h1 className="font-semibold text-xl text-gray-800 mb-4">COD Orders</h1>
          <ul className="space-y-6 overflow-y-auto max-h-[70vh]">
            {
              cash.map((order) => (
                <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200">
                  <li className="text-sm text-gray-600"><span className="font-semibold">Order ID:</span> {order.orderId}</li>
                  <li className="text-sm text-gray-600"><span className="font-semibold">Customer Name:</span> {order.userId.name}</li>
                  <p className="text-sm font-semibold text-gray-700 mt-2">Products:</p>
                  <ul className="list-disc pl-6">
                    {
                      order.product_details.map((prod) => (
                        <li key={prod.name} className="text-sm text-gray-600">{prod.name} - Qty {prod.quantity} - {prod.unit}</li>
                      ))
                    }
                  </ul>
                  <div className="flex justify-between text-sm text-gray-600 mt-4">
                    <div><span className="font-semibold">Total Qty:</span> {order.totalQty}</div>
                    <div><span className="font-semibold">Amount:</span> Rs. {order.totalAmt}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Address:</span> {order.delivery_address.city}, {order.delivery_address.address_line}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Mobile:</span> {order.delivery_address.mobile}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Status:</span> {order.payment_status}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className='font-semibold'>Ordered On: </span> {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            }
          </ul>
        </div>
      </div>
    </section>
  )
}

export default OrdersAdmin
